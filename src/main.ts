import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config port
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  // config security
  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:3066',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,X-Custom-Header',
    exposedHeaders: 'X-Custom-Header,X-Another-Header',
    credentials: true,
    preflightContinue: true,
  });

  // config tools
  app.use(compression())

  // config middleware
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
