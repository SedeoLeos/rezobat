import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { User } from 'src/api/user/schemas/user.schema.js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  LOGO_APP = this.config.get('MAIL_LOGO');
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async signup(user: User, value: string): Promise<SentMessageInfo> {
    try {
      return await this.mailerService.sendMail({
        to: ['gedeon.matsoula@nanocreatives.com', user.email],
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
                            <div style="padding-bottom: 20px;"><img src="${this.LOGO_APP}"  alt="Company" style="width: 80px;"></div>
                          </div>
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: center;">
                              <h1 style="margin: 1rem 0">code de vérification</h1>
                              <p style="padding-bottom: 16px">Veuillez utiliser le code de vérification ci-dessous pour vous connecter.</p>
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
  async create(
    user: User,
    value: string,
    login: string,
  ): Promise<SentMessageInfo> {
    try {
      return await this.mailerService.sendMail({
        to: ['gedeon.matsoula@nanocreatives.com', user.email],
        subject: 'Informations de connexion',
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
                            <div style="padding-bottom: 20px;"><img src="${this.LOGO_APP}" alt="Company" style="width: 80px;"></div>
                          </div>
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: center;">
                              <h1 style="margin: 1rem 0">Informations de connexion :</h1>
                              <p style="padding-bottom: 16px">Nom d'utilisateur :  <strong style="font-size: 130%">${login}</strong></p>
                              <p style="padding-bottom: 16px">Mot de passe : <strong style="font-size: 130%">${value}</strong></p>
                              <p style="padding-bottom: 16px">Ceci est un message contenant vos informations de connexion. Si vous n'avez pas demandé ces informations, veuillez les ignorer.</p>
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
  async resetPassword(user: User, value: string): Promise<SentMessageInfo> {
    try {
      return await this.mailerService.sendMail({
        to: ['gedeon.matsoula@nanocreatives.com', user.email],
        subject: 'Mot de passe oblié',
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
                            <div style="padding-bottom: 20px;"><img src="${this.LOGO_APP}" alt="Company" style="width: 80px;"></div>
                          </div>
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: center;">
                              <h1 style="margin: 1rem 0">Code de réinitialisation du mot de passe :</h1>
                              <p style="padding-bottom: 16px"><strong style="font-size: 130%">${value}</strong></p>
                              <p style="padding-bottom: 16px">Si vous n'avez pas demandé la réinitialisation du mot de passe, veuillez ignorer cet e-mail.</p>
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
}
