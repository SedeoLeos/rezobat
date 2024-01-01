import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
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
    const otp = randomInt(100000, 999999);
    const value = await argon.hash(otp.toString());

    const time_value = parseInt(this.confige_service.get('OTP_TIME_VALUE'));

    const time_unit = this.confige_service.get(
      'OTP_TIME_UNIT',
    ) as dayjs.ManipulateType;

    return await new this.model({
      [type]: true,
      value,
      expire: otpExxpiry(time_value, time_unit),
      phone: user.phone,
      user,
    }).save();
  }
}
