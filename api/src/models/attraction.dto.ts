import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Trim } from './transformers';

export class CreateAttractionDto {
  @Trim() // "   " deixa de passar como nome válido
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;
}

export class UpdateAttractionDto extends PartialType(CreateAttractionDto) {}
