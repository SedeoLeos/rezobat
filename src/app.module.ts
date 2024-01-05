import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { MediaModule } from './api/media/media.module';
import { RequestForServiceModule } from './api/request_for_service/request_for_service.module';
import { CategoryModule } from './api/category/category.module';
import { SubCategoryModule } from './api/sub-category/sub-category.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './core/mail/mail.module';
import { Category } from './api/category/schema/category.schema';
import { SubCategory } from './api/sub-category/schemas/sub-category.schema';
import { Model } from 'mongoose';
import { AdminModule } from '@admin-bro/nestjs';
import { User } from './api/user/schemas/user.schema';
import AdminBroMongoose from '@admin-bro/mongoose';
import AdminBro from 'admin-bro';
// AdminBro.registerAdapter(AdminBroMongoose);
(async () => {
  const AdminJSMongoose = await import('@adminjs/mongoose');
  const { AdminJS } = await import('adminjs');
  console.log(3);

  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });
})();

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
        uri: config.get('URL_DATABASE'),
      }),
    }),
    // AdminBro,
    // // MongooseModule.forRoot('mongodb://localhost/rezobat'),
    // AdminModule.createAdminAsync({
    //   imports: [
    //     UserModule, // importing module that exported model we want to inject
    //   ],
    //   inject: [
    //     getModelToken('User'), // using mongoose function to inject dependency
    //   ],
    //   useFactory: (adminModel: Model<User>) => ({
    //     // injected dependecy will appear as an argument
    //     adminBroOptions: {
    //       rootPath: '/admin',
    //       resources: [{ resource: adminModel }],
    //     },
    //   }),
    // }),

    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [
          UserModule, // importing module that exported model we want to inject
        ],
        inject: [
          getModelToken('User'), // using mongoose function to inject dependency
        ],
        useFactory: () => {
          console.log(1)
          return {
            adminJsOptions: {
              rootPath: '/admin',
              resources: [{ resource: User }],
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
