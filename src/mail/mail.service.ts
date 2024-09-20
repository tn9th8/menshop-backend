import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendVerifyLink(user: SignUpDto, verifyLink: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Menshop Account Team" <account-team@menshop.com>', // override default from
      subject: 'Welcome to Nice App! Verify Your Email Address',
      // template: './confirmation', // `.hbs` extension is appended automatically
      html: `<a href="${verifyLink}"> Verify Email Address </a>`,

    });
  }
}
