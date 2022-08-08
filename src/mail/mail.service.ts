import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';

@Injectable()
export class MailService {
  constructor(
    private mailService: MailerService,
    private configService: ConfigService,
  ) {}

  public sendVerificationLink(email: string, token: string) {
    const url = `${this.configService.get<string>(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.mailService.sendMail({
      to: email,
      from: this.configService.get<string>('MAIL_FROM'),
      subject: 'Email confirmation',
      text,
    });
  }
  public sendResetPasswordLink(email: string, token: string) {
    const url = `${this.configService.get<string>(
      'PASSWORD_RESET_URL',
    )}?token=${token}`;

    const text = `To reset the email password, click here: ${url}`;
    // In order to change the password, there should be a frontend of password reset page

    return this.mailService.sendMail({
      to: email,
      from: this.configService.get<string>('MAIL_FROM'),
      subject: 'Password Reset',
      text,
    });
  }
}
