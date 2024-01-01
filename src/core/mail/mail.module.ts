import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
// import { join } from 'path';
// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_CLIENT,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL_CLIENT,
      },
      //   template: {
      //     dir: join(process.cwd(), 'views/pages'),
      //     adapter: new EjsAdapter(),
      //     options: {
      //       strict: true,
      //       satisfies: {
      //         directory: join(process.cwd(), 'public'),
      //       },
      //     },
      //   },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
