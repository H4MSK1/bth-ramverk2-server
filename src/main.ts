import './config/config.loader';
import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  await app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST);
}

bootstrap();
