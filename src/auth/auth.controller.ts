import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import ConfirmEmailDto from './dto/confirm-email.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import RequestResetPasswordDto from './dto/request-reset-password.dto';
import ResetPasswordDto from './dto/reset-password.dto';

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

  @Post('/password')
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ) {
    return this.authService.requestResetPassword(requestResetPasswordDto);
  }

  @Patch('/password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('confirm-email')
  async confirm(@Query() confirmationData: ConfirmEmailDto) {
    const email = await this.authService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.authService.confirmEmail(email);
  }
}
