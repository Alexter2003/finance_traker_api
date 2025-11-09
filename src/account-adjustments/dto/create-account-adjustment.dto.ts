import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsDateString,
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccountAdjustmentDto {
  @ApiProperty({
    description: 'ID de la cuenta a ajustar',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  accountId: number;

  @ApiProperty({
    description:
      'Monto del ajuste (positivo para aumentar, negativo para disminuir)',
    example: -50.0,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({
    description: 'Razón del ajuste',
    example: 'Corrección de diferencia por error de registro',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  reason: string;

  @ApiProperty({
    description: 'Fecha del ajuste',
    example: '2024-01-15T00:00:00.000Z',
    type: String,
  })
  @IsDateString()
  date: string;
}

