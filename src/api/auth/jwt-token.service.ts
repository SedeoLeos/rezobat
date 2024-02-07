import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Token, TokenDocument } from './schemas/token.schema';
import dayjs from 'dayjs';
import * as argon from 'argon2';
import { TokenBuilder, TokenI } from './tools/token.builder';
export type OptionToken = {
  tokenId?: string;
  refresh?: boolean;
};
export type OptionTime = {
  time_value: number;
  time_unit: string;
  secret: string;
};
const getExpiry = (value: number, unit: dayjs.ManipulateType) =>
  dayjs().add(value, unit).toDate();
@Injectable()
export class JwtTokenService {
  constructor(
    private confige_service: ConfigService,
    private jwt_service: JwtService,
    @InjectModel(Token.name) private model: Model<TokenDocument>,
  ) {}
  async generateTokens(payload: TokenBuilder<User>, option?: OptionToken) {
    const USER = payload.data.user;
    if (!option) {
      option = {
        refresh: true,
      };
    }
    const accessOption: OptionTime = {
      time_value: this.confige_service.get('ACCESS_TIME_VALUE'),
      time_unit: this.confige_service.get('ACCESS_TIME_UNIT'),
      secret: this.confige_service.get('JWT_ACCESS_SECRET'),
    };
    if (!option.refresh) {
      accessOption.time_value = 2;
      accessOption.time_unit = 'd';
    }
    const data = payload.builde();
    const access_token = await this.getJwtToken(data, accessOption);

    if (!option.refresh) {
      const { user } = payload.data;
      return {
        access_token,
        user,
      };
    }
    const refreshOption: OptionTime = {
      secret: this.confige_service.get('JWT_REFRESH_TOKEN_SECRET'),
      time_value: this.confige_service.get('REFRESH_TIME_VALUE'),
      time_unit: this.confige_service.get('REFRESH_TIME_UNIT'),
    };
    const newRefreshToken = await this.getJwtToken(data, refreshOption);
    const hash = await argon.hash(newRefreshToken.value);
    const { tokenId } = option;
    const { user } = payload.data;
    if (tokenId) {
      const { _id: id } = await this.model
        .findByIdAndUpdate(
          tokenId,
          {
            refreshToken: hash,
            user: { _id: USER.id },
          },
          { new: true },
        )
        .exec();

      return {
        access_token,
        refresh_token: newRefreshToken,
        tokenId: id,
        user: user,
      };
    }
    const { _id: id } = await new this.model({
      refreshToken: hash,
      user: USER,
    }).save();

    return {
      access_token,
      refresh_token: newRefreshToken,
      tokenId: id,
      user: user,
    };
  }
  async getPlayload(token: string): Promise<TokenI<User>> {
    return await this.jwt_service.verifyAsync<TokenI<User>>(token, {
      secret: this.confige_service.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }
  async getJwtToken(payload: TokenI<User>, optionTime: OptionTime) {
    const expiresIn = optionTime
      ? optionTime.time_value + optionTime.time_unit
      : this.confige_service.get('ACCESS_TIME_VALUE') +
        this.confige_service.get('ACCESS_TIME_UNIT');

    const token = await this.jwt_service.signAsync(
      { data: payload },
      {
        secret: optionTime.secret,
        expiresIn,
      },
    );

    const expire = getExpiry(
      optionTime.time_value,
      optionTime.time_unit as dayjs.ManipulateType,
    );
    return {
      value: token,
      expire,
    };
  }
}
