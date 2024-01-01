import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async activeFolder(user: any, password: string): Promise<SentMessageInfo> {
    try {
      return await this.mailerService.sendMail({
        to: ['roslymokambovg@gmail.com', user.email],
        from: {
          name: process.env.APP_NAME,
          address: process.env.EMAIL_CLIENT,
        },
        subject: 'Dossier Activer',
        template: 'active_compte',
        context: {
          user: user,
          password: password,
          plateforme: 'Taxe Paye',
          link: 'localhost:3000',
          subject: 'Activation du dossier',
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  async aagntCreated(user: any, password: string): Promise<SentMessageInfo> {
    try {
      return await this.mailerService.sendMail({
        to: ['roslymokambovg@gmail.com', user.email],
        from: {
          name: process.env.APP_NAME,
          address: process.env.EMAIL_CLIENT,
        },
        subject: 'Agent Crée',
        template: 'active_compte',
        context: {
          user: user,
          password: password,
          plateforme: 'Taxe Paye',
          link: 'localhost:3000',
          subject: 'Compte Créer',
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
