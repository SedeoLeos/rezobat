import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

const start = async () => {
  const { Database, Resource } = await import('@adminjs/mongoose');
  const AdminJS = (await import('adminjs')).default;
  AdminJS.registerAdapter({
    Database,
    Resource,
  });
};
async function bootstrap() {
  await start();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await mongoose.connect(`${process.env.DATABASE_URL}`);
  // const AdminJS = (await import('adminjs')).default;
  // const AdminJSExpress = (await import('@adminjs/express')).default;
  // // We will need to create an instance of AdminJS with a basic resource
  // const admin = new AdminJS({
  //   resources: [
  //     {
  //       resource: PersonModel,
  //     },
  //   ],
  // });

  // const adminRouter = AdminJSExpress.buildRouter(admin);

  // app.use(admin.options.rootPath, adminRouter);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('you app listen to :', process.env.PORT);
  });
}
bootstrap();
