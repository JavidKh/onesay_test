import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttachPreferenceDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Preferences id',
    default: [],
  })
  preferences: [];
}
