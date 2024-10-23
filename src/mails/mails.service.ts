import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignUpClientDto } from 'src/auth/dto/signup-client.dto';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) { }

  //todo: transaction with callback
  async sendVerifyLink({ email, name }, verifyLink: string) {
    await this.mailerService.sendMail({
      to: email,
      from: '"Menshop Account Team" <account@menshop.nestjs.com>',
      subject: 'Welcome to Nice App! Verify Your Email Address',
      template: './verify-email',
      context: {
        receiver: name,
        link: verifyLink,
      }
    });
  }
}
