import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  //todo: transaction with callback
  async sendVerifyLink(user: SignUpDto, verifyLink: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Menshop Account Team" <account@menshop.nestjs.com>',
      subject: 'Welcome to Nice App! Verify Your Email Address',
      template: './verify-email',
      context: {
        receiver: user.name,
        link: verifyLink,
      }
    });
  }
}
