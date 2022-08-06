import { IsNotEmpty, IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export default RequestResetPasswordDto;
