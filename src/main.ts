import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata';
import { SignInDto } from './auth/dto/sign-in.dto';
import { UserSchema } from './modules/users/schemas/user.scheme';

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

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
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  await app.listen(port);
}
bootstrap();
