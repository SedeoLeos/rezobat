import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import * as argon from 'argon2';

import { ConfigService } from '@nestjs/config';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP, OTPDocument } from './schemas/otp.schema';
import { User } from '../user/schemas/user.schema';
import { randomInt } from 'crypto';

const otpExxpiry = (value: number, unit: dayjs.ManipulateType) =>
  dayjs().add(value, unit).toDate();

@Injectable()
export class OTPService {
  constructor(
    private confige_service: ConfigService,
    @InjectModel(OTP.name) private model: Model<OTPDocument>,
  ) {}
  async create(user: User, type: 'is_first_auth' | 'is_forget_password') {
    const otp = randomInt(100000, 999999).toString();
    const value = await argon.hash(otp);

    const time_value = parseInt(this.confige_service.get('OTP_TIME_VALUE'));

    const time_unit = this.confige_service.get(
      'OTP_TIME_UNIT',
    ) as dayjs.ManipulateType;

    const _otp = await new this.model({
      [type]: true,
      value,
      expire: otpExxpiry(time_value, time_unit),
      phone: user.phone,
      user,
    }).save();
    return { otp: _otp, value: otp };
  }
  async findOne(
    phone: string,
    value: string,
    type: 'is_first_auth' | 'is_forget_password',
  ) {
    const otp_value = await this.model
      .findOne({ phone: phone, type })
      .populate('user')
      .exec();
    if (!otp_value) {
      return;
    }
    const isMatch = await argon.verify(otp_value.value, value);
    if (!isMatch) {
      return;
    }
    const expire = dayjs(otp_value.expire);
    const diff = dayjs().diff(expire);
    if (diff < 0) {
      return;
    }
    return otp_value;
  }
}
