import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ExpenseCategoryType } from '@prisma/client';

export class CreateExpenseTypeDto {
  @ApiProperty({
    description: 'Nombre del tipo de gasto',
    example: 'Alimentación',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Tipo de categoría de gasto',
    enum: ExpenseCategoryType,
    example: ExpenseCategoryType.FIXED,
  })
  @IsEnum(ExpenseCategoryType)
  type: ExpenseCategoryType;

  @ApiProperty({
    description: 'Descripción opcional del tipo de gasto',
    example: 'Gastos relacionados con alimentos y bebidas',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
