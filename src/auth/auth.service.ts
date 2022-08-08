import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import ResetPasswordDto from './dto/reset-password.dto';
import RequestResetPasswordDto from './dto/request-reset-password.dto';
import { ResetToken } from './entities/reset-token';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private resetTokensRepository: Repository<ResetToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private jwtSignToken(email: string) {
    const payload: JwtPayload = { email: email };

    return this.jwtService.sign(payload);
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
      const payload: JwtPayload = { email: email };
      const token = this.jwtService.sign(payload, { expiresIn: '3600s' });

      await this.usersRepository.save(user);
      await this.mailService.sendVerificationLink(email, token);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      } else {
        console.log(error);
        throw new BadRequestException('Something went wrong');
      }
    }
    return true;
  }

  public async confirmEmail(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });
    if (user.isConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersRepository.update(
      { email },
      {
        isConfirmed: true,
      },
    );
    return true;
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
      if (!user.isConfirmed) {
        throw new BadRequestException('User is not confirmed');
      }
      const access_token = this.jwtSignToken(user.email);
      return {
        access_token,
      };
    } else {
      throw new BadRequestException('Credentials are wrong');
    }
  }

  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    const { email } = requestResetPasswordDto;
    const user = await this.usersRepository.findOneBy({
      email,
    });
    if (user) {
      await this.resetTokensRepository.delete({ user });

      const resetToken = new ResetToken();
      resetToken.token = uuidv4().toString();
      resetToken.user = user;
      await this.resetTokensRepository.save(resetToken);

      await this.mailService.sendResetPasswordLink(email, resetToken.token);
      return true;
    } else {
      throw new BadRequestException('User not found');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password, confirm_password } = resetPasswordDto;
    const resetToken = await this.resetTokensRepository.findOne({
      relations: {
        user: true,
      },
      where: { token, isConfirmed: false },
    });

    if (!resetToken) {
      throw new BadRequestException('token not found');
    }

    const email = resetToken.user.email;

    const user = await this.usersRepository.findOneBy({
      email,
    });
    if (!user) {
      throw new BadRequestException(' User is not found');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    if (password === confirm_password && user) {
      await this.resetTokensRepository.delete({ token });

      await this.usersRepository.update(
        { email },
        {
          password: hashedPassword,
        },
      );
      return true;
    } else {
      throw new BadRequestException(
        'Password is not the same as confirmed password',
      );
    }
  }
}
