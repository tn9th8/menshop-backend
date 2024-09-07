import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config port
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  // config security
  app.use(helmet());

  // config tools
  app.use(compression())

  await app.listen(port);
}
bootstrap();
