import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import * as argon from 'argon2';

import { ConfigService } from '@nestjs/config';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP, OTPDocument } from './schemas/otp.schema.js';
import { User } from '../user/schemas/user.schema.js';
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
    const found = await this.model.findOne({
      email: user.email,
      [type]: true,
    });

    // 4 digits OTP to comply with the figma design (specifications)
    const otp = randomInt(1000, 9999).toString();
    const value = await argon.hash(otp);

    const time_value = parseInt(this.confige_service.get('OTP_TIME_VALUE'));

    const time_unit = this.confige_service.get(
      'OTP_TIME_UNIT',
    ) as dayjs.ManipulateType;
    if (found) {
      const _otp = await this.model
        .updateOne(
          {
            email: user.email,
            user: {
              _id: user._id,
            },
          },
          {
            [type]: true,
            value,
            expire: otpExxpiry(time_value, time_unit),
            email: user.email,
            user,
          },
          { new: true },
        )
        .exec();

      return { otp: _otp, value: otp };
    }

    const _otp = await new this.model({
      [type]: true,
      value,
      expire: otpExxpiry(time_value, time_unit),
      email: user.email,
      user,
    }).save();
    return { otp: _otp, value: otp };
  }
  async findOne(
    email: string,
    value: string,
    type: 'is_first_auth' | 'is_forget_password',
  ) {
    const otp_value = await this.model
      .findOne({ email, [type]: true })
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
    const diff = dayjs().diff(expire, 'minutes', true);
    if (!diff) {
      return;
    }
    return otp_value;
  }
}
