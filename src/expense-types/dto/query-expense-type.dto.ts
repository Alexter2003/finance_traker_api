import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseCategoryType } from '@prisma/client';

export class QueryExpenseTypeDto {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de categoría',
    enum: ExpenseCategoryType,
    example: ExpenseCategoryType.FIXED,
  })
  @IsOptional()
  @IsEnum(ExpenseCategoryType)
  type?: ExpenseCategoryType;

  @ApiPropertyOptional({
    description: 'Buscar por nombre (búsqueda parcial)',
    example: 'Alimentación',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
