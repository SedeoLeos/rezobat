import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

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
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('you app listen to :', process.env.PORT);
  });
}
bootstrap();
