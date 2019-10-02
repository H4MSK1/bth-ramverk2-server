import './config/config.loader';
import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

//import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.useWebSocketAdapter(new IoAdapter(app));

  app.use(helmet());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://jsramverk.alburhan.se'
        : '*',
  });

  await app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST);
}

bootstrap();
