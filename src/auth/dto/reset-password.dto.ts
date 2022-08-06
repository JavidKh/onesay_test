import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  confirm_password: string;
}

export default ResetPasswordDto;
