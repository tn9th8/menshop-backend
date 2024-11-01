import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SignInDto } from './shared/auth/dto/sign-in.dto';
import metadata from './metadata';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // config mvc
  app.useStaticAssets(join(__dirname, '..', 'public')); // js, css, images // __dirname: chỉ ra path đến file main
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // view
  app.setViewEngine('ejs');


  // config security
  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:3066,http://localhost:3088',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,X-Custom-Header,X-No-Compression',
    exposedHeaders: 'X-Custom-Header,X-Another-Header', // todo
    credentials: true,
    preflightContinue: true,
  });

  // config middlewares
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'], // v1
  });

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

  //todo
  app.useGlobalPipes(new ValidationPipe(
    // { whitelist: true }
  ));

  app.use(cookieParser());

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('Menshop APIs Document')
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

  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config,
    {
      extraModels: [SignInDto],
      deepScanRoutes: true,
      operationIdFactory: (
        controllerKey: string,
        methodKey: string,
      ) => `${methodKey}-${controllerKey}`,
    }
  );

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });


  // config server
  const port = configService.get<string>('PORT');
  await app.listen(port);
}
bootstrap();
