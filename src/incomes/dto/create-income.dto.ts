import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IncomeFrequency } from '@prisma/client';

export class CreateIncomeDto {
  @ApiProperty({
    description: 'Monto del ingreso',
    example: 5000.0,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'ID de la cuenta asociada',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  accountId: number;

  @ApiProperty({
    description: 'Frecuencia del ingreso',
    enum: IncomeFrequency,
    example: IncomeFrequency.RECURRENT_MONTHLY,
  })
  @IsEnum(IncomeFrequency)
  frequency: IncomeFrequency;

  @ApiProperty({
    description: 'Descripción del ingreso',
    example: 'Salario mensual',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Fecha del ingreso',
    example: '2024-01-15T00:00:00.000Z',
    type: String,
  })
  @IsDateString()
  date: string;
}
