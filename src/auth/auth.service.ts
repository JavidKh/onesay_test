import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtPayload } from './dto/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailerService,
    private configService: ConfigService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: JwtPayload = { email: email };

    const token = this.jwtService.sign(payload);

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

  async register(registerCredentialsDto: RegisterCredentialsDto) {
    const { email, password, full_name, dob } = registerCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      email,
      dob,
      password: hashedPassword,
      full_name,
    });
    try {
      await this.usersRepository.save(user);
      this.sendVerificationLink(email);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      } else {
        console.log(error);
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  public async confirmEmail(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });
    if (user.isConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    return this.usersRepository.update(
      { email },
      {
        isConfirmed: true,
      },
    );
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async login(loginCredentialsDto: LoginCredentialsDto) {
    const { email, password } = loginCredentialsDto;
    const user = await this.usersRepository.findOneBy({
      email,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email: user.email };
      if (!user.isConfirmed) {
        throw new BadRequestException('User is not confirmed');
      }
      const access_token: string = await this.jwtService.sign(payload);
      return {
        access_token,
      };
    } else {
      throw new BadRequestException('Credentials are wrong');
    }
  }

  async getUser(user: User) {
    return {
      fullname: user.full_name,
      email: user.email,
      dob: user.dob,
    };
  }
}
