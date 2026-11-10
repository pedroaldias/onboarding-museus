import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from './transformers';

export class CreateWorkDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  author: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;
}
