import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { MediaModule } from './api/media/media.module';
import { RequestForServiceModule } from './api/request_for_service/request_for_service.module';
import { CategoryModule } from './api/category/category.module';
import { SubCategoryModule } from './api/sub-category/sub-category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './core/mail/mail.module';
import { UserModel } from './admin/user.model';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NestjsFormDataModule } from 'nestjs-form-data';
const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};
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
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [
          UserModule, // importing module that exported model we want to inject
        ],
        inject: [ConfigService],
        useFactory: async () => {
          // const AdminJSMongoose = await import('@adminjs/mongoose');
          // const db = new AdminJSMongoose.Resource(config.get('URL_DATABASE'));

          return {
            adminJsOptions: {
              rootPath: '/admin',
              resources: [{ resource: UserModel }],
            },
            auth: {
              authenticate,
              cookieName: 'adminjs',
              cookiePassword: 'secret',
            },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: 'secret',
            },
          };
        },
      }),
    ),
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    UserModule,
    MediaModule,
    RequestForServiceModule,
    CategoryModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
