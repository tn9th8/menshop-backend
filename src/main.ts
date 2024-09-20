import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    allowedHeaders: 'Content-Type,Authorization,X-Custom-Header,X-No-Compression',
    exposedHeaders: 'X-Custom-Header,X-Another-Header',
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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieParser());

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Series APIs Document')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });


  // server
  await app.listen(port);
}
bootstrap();
