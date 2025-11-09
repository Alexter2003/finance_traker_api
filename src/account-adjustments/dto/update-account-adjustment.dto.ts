import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAccountAdjustmentDto {
  @ApiPropertyOptional({
    description: 'ID de la cuenta a ajustar',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  accountId?: number;

  @ApiPropertyOptional({
    description:
      'Monto del ajuste (positivo para aumentar, negativo para disminuir)',
    example: -50.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;

  @ApiPropertyOptional({
    description: 'Razón del ajuste',
    example: 'Corrección de diferencia por error de registro',
    minLength: 1,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    description: 'Fecha del ajuste',
    example: '2024-01-15T00:00:00.000Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}

