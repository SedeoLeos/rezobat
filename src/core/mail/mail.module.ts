import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
// import { join } from 'path';
// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: config.get('MAIL_SERVICE'),
          host: config.get('MAIL_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: config.get('MAIL_CLIENT'),
            pass: config.get('MAIL_PASSWORD'),
          },
          from: {
            name: config.get('MAIL_APP'),
            address: config.get('MAIL_CLIENT'),
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
