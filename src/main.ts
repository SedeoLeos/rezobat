import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // console.log(__dirname);
  // const AdminJS = await import('adminjs');
  // const AdminJSExpress = await import('@adminjs/express');
  // const AdminJSMongoose = await import('@adminjs/mongoose');

  // const expressApp = app.get(HttpAdapterHost).httpAdapter;
  // const admin = new AdminJS.default({});
  // expressApp.use(
  //   admin.options.rootPath,
  //   AdminJSExpress.default.buildRouter(admin),
  //   AdminJS.default.registerAdapter({
  //     Resource: AdminJSMongoose.Resource,
  //     Database: AdminJSMongoose.Database,
  //   }),
  // );
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: 'public' });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('you app listen to :', process.env.PORT);
  });
}
bootstrap();
