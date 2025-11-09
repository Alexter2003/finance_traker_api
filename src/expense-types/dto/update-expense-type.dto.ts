import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ExpenseCategoryType } from '@prisma/client';

export class UpdateExpenseTypeDto {
  @ApiPropertyOptional({
    description: 'Nombre del tipo de gasto',
    example: 'Alimentación',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Tipo de categoría de gasto',
    enum: ExpenseCategoryType,
    example: ExpenseCategoryType.VARIABLE,
  })
  @IsOptional()
  @IsEnum(ExpenseCategoryType)
  type?: ExpenseCategoryType;

  @ApiPropertyOptional({
    description: 'Descripción opcional del tipo de gasto',
    example: 'Gastos relacionados con alimentos y bebidas',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
