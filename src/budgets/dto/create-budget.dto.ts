import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
  @ApiProperty({
    description: 'ID del tipo de gasto (debe ser tipo FIXED)',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  expenseTypeId: number;

  @ApiProperty({
    description: 'Monto mensual total del presupuesto',
    example: 600.0,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyAmount: number;

  @ApiPropertyOptional({
    description:
      'Monto quincenal (si no se proporciona, se calcula como monthlyAmount / 2)',
    example: 300.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  biweeklyAmount?: number;

  @ApiPropertyOptional({
    description:
      'Saldo pendiente del período anterior (por defecto 0 si es el primer presupuesto)',
    example: 50.0,
    type: Number,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pendingAmount?: number;

  @ApiProperty({
    description: 'Fecha de inicio de la quincena',
    example: '2024-01-01T00:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin de la quincena',
    example: '2024-01-15T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  endDate: string;
}

