import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCreditCardDto {
  @ApiProperty({
    description: 'Nombre de la tarjeta de crédito',
    example: 'Visa Principal',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Balance inicial de la tarjeta (generalmente 0 o el límite de crédito)',
    example: 0.0,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  initialBalance: number;
}

