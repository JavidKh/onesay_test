import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(4)
  @MaxLength(32)
  confirm_password: string;
}

export default ResetPasswordDto;
