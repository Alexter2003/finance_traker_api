import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Monto del gasto',
    example: 150.0,
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
    description: 'ID del tipo de gasto asociado',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  expenseTypeId: number;

  @ApiProperty({
    description: 'Descripción del gasto',
    example: 'Compra de supermercado',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Fecha del gasto',
    example: '2024-01-15T00:00:00.000Z',
    type: String,
  })
  @IsDateString()
  date: string;
}

