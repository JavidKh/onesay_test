import { IsNotEmpty } from 'class-validator';

export class CreatePreferenceDto {
  @IsNotEmpty()
  name: string;
}
