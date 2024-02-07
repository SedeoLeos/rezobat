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
      // throw new HttpException(
      //   "Votre compte n'est pas activé",
      //   HttpStatus.UNAUTHORIZED,
      // );
      /**
       * Let's give the user the possibility to activate his account with
       * the otp previously sent by email.
       */
      const tokenbuilder = new TokenBuilder<User>();
      tokenbuilder
        .setUser(user)
        .removeDefaultAbilitys()
        .addAbilitys(AbilitysEnum.VERIFIED_OTP);
      return await this.jwt_token_service.generateTokens(tokenbuilder, {
        refresh: false,
      });
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
    payload.abilitys.forEach((name) => {
      tokenbuilder.addAbilitys(name);
    });
    tokenbuilder.setUser(payload.user);
    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      tokenId,
      refresh: true,
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
    const otp = await this.opt_service.create(found, type);
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

  /**
   * Allow the user to request a one time password
   * in order to reset his forgotten password.
   */
  async otpPassword(playload: OTPPasswordDTO) {
    const found = await this.user_service.findBy(playload.email);
    if (!found) {
      return;
    }
    const otp = await this.opt_service.create(found, playload.type);

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

    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      refresh: false,
    });
  }

  /**
   * Reset the user's password after the
   * Abilitys UPDATE_PASSWORD was found by the guard system.
   */
  async resetPassword(user_: User, value: string) {
    try {
      const password = await argon.hash(value);
      const user = await this.user_service.updateSimple(user_.id, { password });
      return this.makeCompleted(user);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Verify the otp and generates new jwt credentials.
   * If the otp type is `is_first_auth` the new access token
   * has the abilitys `ACTIVE_USER`.
   *
   * If the otp type is `is_forget_password` the new access token
   * has the abilitys `UPDATE_PASSWORD`.
   */
  async otpVerify(dto: OTPVerifyDto) {
    const { email, type, otp } = dto;

    const data = await this.opt_service.findOne(email, otp, type);
    if (!data) {
      throw new UnauthorizedException('Otp incorrect.');
    }

    let { user } = data;
    if (type === 'is_first_auth') {
      user = await this.user_service.updateSimple(user._id, {
        active: true,
      });

      return await this.makeCompleted(user);
    }

    const tokenbuilder = new TokenBuilder<User>();
    const ability = AbilitysEnum.UPDATE_PASSWORD;
    tokenbuilder.setUser(user).removeDefaultAbilitys().addAbilitys(ability);
    return await this.jwt_token_service.generateTokens(tokenbuilder, {
      refresh: false,
    });
  }

  async makeCompleted(user: User) {
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder.setUser(user);
    /**
     * TODO: check if all abilities are given
     * to this user according to his current state.
     */

    if (user.isAdmin) {
      tokenbuilder.addAbilitys(AbilitysEnum.ADMIN);
    }

    if (user.role == 'Provider') {
      tokenbuilder.addAbilitys(AbilitysEnum.ARTISANT);
    }

    if (user.role == 'Client') {
      tokenbuilder.addAbilitys(AbilitysEnum.CLIENT);
    }

    if (user.active) {
      tokenbuilder.addAbilitys(AbilitysEnum.ACTIVE_USER);
    }

    return await this.jwt_token_service.generateTokens(tokenbuilder);
  }
}
