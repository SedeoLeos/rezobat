import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { MediaModule } from './api/media/media.module';
import { ContractModule } from './api/contract/contract.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './core/mail/mail.module';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UniqueConstraintMongoose } from './core/decorators/unique.decorators';
import { ExistConstraintMongoose } from './core/decorators/exist.decorators';
import { JobModule } from './api/job/job.module';
import { ContractTypeModule } from './api/contrat-type/contract-type.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DATABASE_URL'),
      }),
    }),
    NestjsFormDataModule.config({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    UserModule,
    MediaModule,
    ContractModule,
    JobModule,
    ContractTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService, UniqueConstraintMongoose, ExistConstraintMongoose],
})
export class AppModule {}
