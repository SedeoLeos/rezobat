import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module.js';
import { OTP, OTPSchema } from './schemas/otp.schema.js';
import { OTPService } from './otp.service.js';
import { JwtTokenService } from './jwt-token.service.js';
import { Auth0Guard } from './guard/jwt.guard.js';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_TOKEN_SECRET'),
      }),
    }),
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: OTP.name, schema: OTPSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OTPService,
    JwtTokenService,
    {
      provide: APP_GUARD,
      useClass: Auth0Guard,
    },
  ],
})
export class AuthModule {}
