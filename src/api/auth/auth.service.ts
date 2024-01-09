import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import {
  OTPPasswordDTO,
  OTPRefreshDTO,
  OTPVerifyDto,
  UpdatePasswordDto,
} from './dto/otp.dto.js';
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
    if (!user)
      throw new HttpException(
        'utilisateur introuvable',
        HttpStatus.UNAUTHORIZED,
      );
    if (!user.password)
      throw new HttpException(
        'mot de passe incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    const isMatch = await argon.verify(user.password, login_dto.password);

    if (!isMatch)
      throw new HttpException('password incorrect', HttpStatus.UNAUTHORIZED);
    if (!user.active)
      throw new HttpException(
        "Votre compte n'est pas activer",
        HttpStatus.UNAUTHORIZED,
      );

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
      .populate('user', null)
      .exec();

    const isMatch = await argon.verify(
      found_token.refreshToken ?? '',
      refreshToken,
    );

    if (found_token == null) {
      //refresh token is valid but the id is not in database
      //TODO:inform the user with the payload sub
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!isMatch) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder.setUser(payload.user);
    payload.abilitys.forEach((name) => {
      tokenbuilder.addAbilitys(name);
    });
    tokenbuilder.setUser(payload.user);
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
  async activate_account(user: User) {
    console.log(user);
    const { _id: id } = user;
    const _user = await this.user_service.updateSimple(id, { active: true });
    return await this.makeCompleted(_user);
  }
  async reset_password(user: User, payload: UpdatePasswordDto) {
    console.log(user);
    const { _id: id } = user;
    const hash = argon.hash(payload.password);
    const _user = await this.user_service.updateSimple(id, {
      password: hash,
    });
    return await this.makeCompleted(_user);
  }
  async makeCompleted(user: User) {
    const tokenbuilder = new TokenBuilder<User>();
    tokenbuilder.setUser(user.toJSON());
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
