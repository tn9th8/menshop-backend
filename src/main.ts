import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config security
  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:3066',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,X-Custom-Header,X-No-Compression',
    exposedHeaders: 'X-Custom-Header,X-Another-Header', // todo
    credentials: true,
    preflightContinue: true,
  });

  // config middleware
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['X-No-Compression']) {
        return false;
      }
      return true;
    },
    threshold: 4 * 1024, // bytes
    level: 6 // compromise speed & compression
  }));

  app.useGlobalPipes(new ValidationPipe());

  // config server
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  await app.listen(port);
}
bootstrap();
