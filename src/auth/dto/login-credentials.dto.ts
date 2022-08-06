import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginCredentialsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  password: string;
}
