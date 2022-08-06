import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import ConfirmEmailDto from './dto/confirm-email.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
    return this.authService.login(loginCredentialsDto);
  }

  @Post('/register')
  signUp(@Body() registerCredentialsDto: RegisterCredentialsDto) {
    return this.authService.register(registerCredentialsDto);
  }

  @Get('confirm-email')
  async confirm(@Query() confirmationData: ConfirmEmailDto) {
    const email = await this.authService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.authService.confirmEmail(email);
  }
}
