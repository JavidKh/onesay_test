import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterCredentialsDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsDateString()
  dob: Date;
}
