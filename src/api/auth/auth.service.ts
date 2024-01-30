import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';

import { UserService } from '../user/user.service.js';

import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema.js';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema.js';
import { OTPService } from './otp.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { MailService } from './../../core/mail/mail.service.js';
import { LoginDto } from './dto/login.dto.js';
import { OTPPasswordDTO, OTPRefreshDTO, OTPVerifyDto } from './dto/otp.dto.js';
import { JwtTokenService } from './jwt-token.service.js';
import { AbilitysEnum, TokenBuilder, TokenI } from './tools/token.builder.js';
import { ResetPasswordDTO } from './dto/reset-password.dto.js';
@Injectable()
export class AuthService {
  constructor(
    private jwt_token_service: JwtTokenService,
    private user_service: UserService,
    private opt_service: OTPService,
    private mail_service: MailService,
    @InjectModel(Token.name) private model: Model<TokenDocument>,
  ) {}
  private async validateUser(login_dto: LoginDto) {
    const { email } = login_dto;

    const user = await this.user_service.findBy(email);
    return user;
  }
  async signIn(login_dto: LoginDto) {
    const user = await this.validateUser(login_dto);
    if (!user) {
      throw new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND);
    }

    if (!user.password) {
      throw new HttpException(
        'Mot de passe non défini',
        HttpStatus.BAD_REQUEST,
      );
    }

    let isMatch = false;

    try {
      isMatch = await argon.verify(user.password, login_dto.password);
    } catch (e) {
      // Gérer l'erreur de vérification du mot de passe ici
    }

    if (!isMatch) {
      throw new HttpException('Mot de passe incorrect', HttpStatus.BAD_REQUEST);
    }

    if (!user.active) {
      throw new HttpException(
        "Votre compte n'est pas activé",
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.makeCompleted(user);
  }
  async signUp(register_dto: RegisterDto) {
    register_dto.password = await argon.hash(register_dto.password);
    const user = await this.user_service.createSimple(register_dto);
    const { value } = await this.opt_service.create(user, 'is_first_auth');

    this.mail_service.signup(user, value);
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder
      .setUser(user)
      .removeDefaultAbilitys()
      .addAbilitys(AbilitysEnum.VERIFIED_OTP);
    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      refresh: false,
    });
  }
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    tokenId: string,
    payload: TokenI<User>,
  ) {
    const found_token = await this.model
      .findOne({ _id: tokenId })
      .populate({
        path: 'user',
        populate: 'photo',
      })
      .exec();
    let isMatch = false;
    if (found_token == null) {
      //refresh token is valid but the id is not in database
      //TODO:inform the user with the payload sub
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      isMatch = await argon.verify(
        found_token.refreshToken ?? '',
        refreshToken,
      );
    } catch {}

    if (!isMatch) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder.setUser(found_token.user!);
    // payload.abilitys.forEach((name) => {
    //   tokenbuilder.addAbilitys(name);
    // });
    // tokenbuilder.setUser(payload.user);
    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      tokenId,
    });
  }
  async signOut(tokenId: string) {
    try {
      await this.model.findByIdAndDelete(tokenId);
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
  async otpRefresh(playload: OTPRefreshDTO) {
    const { type, email } = playload;
    const found = await this.user_service.findBy(email);
    if (!found) {
      return;
    }
    const otp = await this.opt_service.create(found, type, true);
    if (!otp) {
      return;
    }
    const { value } = otp;
    if (type == 'is_first_auth') {
      await this.mail_service.signup(found, value);
    }
    if (type == 'is_forget_password') {
      await this.mail_service.resetPassword(found, value);
    }
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder
      .setUser(found)
      .removeDefaultAbilitys()
      .addAbilitys(AbilitysEnum.VERIFIED_OTP);
    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      refresh: false,
    });
  }
  async otpPassword(playload: OTPPasswordDTO) {
    const found = await this.user_service.findBy(playload.email);
    if (!found) {
      return;
    }
    const otp = await this.opt_service.create(found, playload.type, false);
    if (!otp) {
      return;
    }
    const { value } = otp;
    await this.mail_service.resetPassword(found, value);
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder
      .setUser(found)
      .removeDefaultAbilitys()
      .addAbilitys(AbilitysEnum.VERIFIED_OTP);

    /**
     * DANGER!!!!
     * You shouldn't return the credentials here. A success response should be the secure way.
     * e.g { message: 'ok' };
     */
    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      refresh: false,
    });
  }
  async otpVerify(dto: OTPVerifyDto) {
    const { email, type, otp } = dto;
    const data = await this.opt_service.findOne(email, otp, type);
    if (!data) {
      return;
    }
    const { user } = data;
    const tokenbuilder = new TokenBuilder<User>();
    const ability =
      type == 'is_first_auth'
        ? AbilitysEnum.ACTIVE_USER
        : AbilitysEnum.UPDATE_PASSWORD;
    tokenbuilder.setUser(user).removeDefaultAbilitys().addAbilitys(ability);
    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      refresh: false,
    });
  }

  /**
   * Update the user's password if the OTP is valid.
   */
  async resetPassword({ email, type, otp, password }: ResetPasswordDTO) {
    const checkOtp = await this.otpVerify({ email, type, otp });
    if (!checkOtp) {
      throw new UnauthorizedException();
    }

    const newPassword = await argon.hash(password);
    const user = await this.user_service.updateSimple(`${checkOtp.user._id!}`, {
      password: newPassword,
    });

    return this.makeCompleted(user);
  }
  async makeCompleted(user: User) {
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder.setUser(user);
    if (user.isAdmin) {
      tokenbuilder.addAbilitys('ADMIN');
    }
    if (user.role == 'Provider') {
      tokenbuilder.addAbilitys('Provider');
    }
    if (user.role == 'Client') {
      tokenbuilder.addAbilitys('Client');
    }
    return await this.jwt_token_service.generateTokens(tokenbuilder);
  }
}
