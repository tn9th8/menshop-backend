import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendVerifyLink(user: SignUpDto, verifyLink: string) {
    await this.mailerService.sendMail({
      to: user.email,
      //from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Verify Your Email Address',
      // template: './confirmation', // `.hbs` extension is appended automatically
      html: `<a href="${verifyLink}"> Verify Email Address </a>`, // HTML body content

      // context: { // ✏️ filling curly brackets with content
      //   name: user.name,
      //   url: verifyLink,
      // },
    });
  }
}
