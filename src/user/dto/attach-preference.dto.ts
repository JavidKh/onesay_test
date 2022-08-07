import { IsNotEmpty } from 'class-validator';

export class AttachPreferenceDto {
  @IsNotEmpty()
  preferences: [];
}
