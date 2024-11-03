import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

//forRootAsync cấu hình 1 lần, sử dụng ở nhiều nơi với cấu hình này => Chỉ có 1 cấu hình
@Module({
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            secure: false, // connect TLS/SSL
            auth: {
              user: configService.get<string>('EMAIL_USER'),
              pass: configService.get<string>('EMAIL_PASS'),
            },
          },
          defaults: {
            from: '"Menshop Customer Service" <customer-service@menshop.nestjs.com>',
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          preview: configService.get<boolean>('EMAIL_PREVIEW'),
        }
      ),
    }),
  ],
})
export class MailsModule { }
