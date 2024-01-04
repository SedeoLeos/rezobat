import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { User } from 'src/api/user/schemas/user.schema.js';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sigup(user: User, value: string): Promise<SentMessageInfo> {
    try {
      return await this.mailerService.sendMail({
        to: ['smatsoula19g@gmail.com', user.email],
        from: {
          name: process.env.APP_NAME,
          address: process.env.EMAIL_CLIENT,
        },
        subject: 'Code de Verification',
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your login</title>
          <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
        </head>
        
        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
          <table role="presentation"
            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
            <tbody>
              <tr>
                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                  <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                    <tbody>
                      <tr>
                        <td style="padding: 40px 0px 0px;">
                          <div style="text-align: left;">
                            <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Company" style="width: 80px;"></div>
                          </div>
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: center;">
                              <h1 style="margin: 1rem 0">code de vérification</h1>
                              <p style="padding-bottom: 16px">Veuillez utiliser le code de vérification ci-dessous pour vous connecter..</p>
                              <p style="padding-bottom: 16px"><strong style="font-size: 130%">${value}</strong></p>
                              <p style="padding-bottom: 16px">Si vous ne l'avez pas demandé, vous pouvez ignorer cet e-mail.</p>
                            </div>
                          </div>
                          <div style="padding-top: 20px; color: rgb(153, 149, 85); text-align: center;">
                            <p style="padding-bottom: 16px">Made with ♥ in Slaega</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        
        </html>`,
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
