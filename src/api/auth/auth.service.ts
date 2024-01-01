import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as argon from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../user/user.service';

import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';

const getExpiry = (value: number, unit: dayjs.ManipulateType) =>
  dayjs().add(value, unit).toDate();
@Injectable()
export class AuthService {
  constructor(
    private confige_service: ConfigService,
    private jwt_service: JwtService,
    private user_service: UserService,
    @InjectModel(Token.name) private model: Model<TokenDocument>,
  ) {}
  private async validateUser(login_dto: any) {
    const { email } = login_dto;

    const user = await this.user_service.findBy(email);
    return user;
  }
  async signIn(login_dto: any) {
    const user = await this.validateUser(login_dto);
    if (!user)
      throw new HttpException('user introuvable', HttpStatus.UNAUTHORIZED);
    if (!user.password)
      throw new HttpException('passe word', HttpStatus.UNAUTHORIZED);
    const isMatch = await argon.verify(user.password, login_dto.password);

    if (!isMatch)
      throw new HttpException('password incorrect', HttpStatus.UNAUTHORIZED);
    return await this.generateTokens(user);
  }
  async signUp(register_dto: any) {
    register_dto.password = await argon.hash(register_dto.password);
    const user = await this.user_service.create(register_dto);
    return await this.generateTokens(user);
  }
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    tokenId: string,
    payload: any,
  ) {
    const found_token = await this.model
      .findOne({ _id: tokenId })
      .populate('user', null)
      .exec();

    const isMatch = await argon.verify(
      found_token.refreshToken ?? '',
      refreshToken,
    );

    const issuedAt = dayjs.unix(payload.iat);
    const diff = dayjs().diff(issuedAt, 'seconds');

    if (found_token == null) {
      //refresh token is valid but the id is not in database
      //TODO:inform the user with the payload sub
      throw new HttpException('Unau thorized', HttpStatus.UNAUTHORIZED);
    }
    const user = found_token.user;
    if (isMatch) {
      return await this.generateTokens(user, tokenId);
    } else {
      //less than 1 minute leeway allows refresh for network concurrency
      if (diff < 60 * 1 * 1) {
        console.log('leeway');
        return await this.generateTokens(user, tokenId);
      }

      //refresh token is valid but not in db
      //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
      if (payload.sub !== found_token.user.id) {
        //the sub of the token isn't the id of the token in db
        // log out all session of this payalod id, reFreshToken has been compromised
        await this.model.findOneAndDelete({ user: { id: payload.sub } });
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
  private async generateTokens(payload: User, tokenId?: string) {
    const { accessToken } = await this.getJwtAccessToken(payload);

    const { refreshToken: newRefreshToken } =
      await this.getJwtRefreshToken(payload);

    const hash = await argon.hash(newRefreshToken);
    if (tokenId) {
      const { _id: id } = await this.model
        .findByIdAndUpdate(tokenId, {
          refreshToken: hash,
          user: payload,
        })
        .exec();
      return {
        accessToken,
        refreshToken: newRefreshToken,
        tokenId: id,
        access_token_expires: getExpiry(
          parseInt(this.confige_service.get('ACCESS_TIME_VALUE')),
          this.confige_service.get('ACCESS_TIME_UNIT') as dayjs.ManipulateType,
        ),
        refresh_token_expires: getExpiry(
          parseInt(this.confige_service.get('REFRESH_TIME_VALUE')),
          this.confige_service.get('REFRESH_TIME_UNIT') as dayjs.ManipulateType,
        ),
        user: payload,
      };
    }
    const { _id: id } = await new this.model({
      refreshToken: hash,
      user: payload,
    }).save();

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenId: id,
      access_token_expires: getExpiry(
        parseInt(this.confige_service.get('ACCESS_TIME_VALUE')),
        this.confige_service.get('ACCESS_TIME_UNIT') as dayjs.ManipulateType,
      ),
      refresh_token_expires: getExpiry(
        parseInt(this.confige_service.get('REFRESH_TIME_VALUE')),
        this.confige_service.get('REFRESH_TIME_UNIT') as dayjs.ManipulateType,
      ),
      user: payload,
    };
  }
  async signOut(tokenId: string) {
    try {
      await this.model.findByIdAndDelete(tokenId);
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getJwtAccessToken(payload: User) {
    const accessToken = await this.jwt_service.signAsync(payload, {
      secret: this.confige_service.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.confige_service.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return {
      accessToken,
    };
  }
  public async getJwtRefreshToken(payload: User) {
    const refreshToken = await this.jwt_service.signAsync(payload, {
      secret: this.confige_service.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.confige_service.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    return {
      refreshToken,
    };
  }
}
