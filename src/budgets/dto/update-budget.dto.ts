import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBudgetDto {
  @ApiPropertyOptional({
    description: 'Monto mensual total del presupuesto',
    example: 600.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyAmount?: number;

  @ApiPropertyOptional({
    description: 'Monto quincenal',
    example: 300.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  biweeklyAmount?: number;

  @ApiPropertyOptional({
    description: 'Saldo pendiente del período anterior',
    example: 50.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pendingAmount?: number;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de la quincena',
    example: '2024-01-01T00:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin de la quincena',
    example: '2024-01-15T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Indica si el presupuesto está activo',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}

