import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterCredentialsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  full_name: string;

  @IsDateString()
  dob: Date;
}
