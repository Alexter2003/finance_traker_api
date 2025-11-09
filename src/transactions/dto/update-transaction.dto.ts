import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTransactionDto {
  @ApiPropertyOptional({
    description: 'ID de la cuenta de origen',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fromAccountId?: number;

  @ApiPropertyOptional({
    description: 'ID de la cuenta de destino',
    example: 2,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  toAccountId?: number;

  @ApiPropertyOptional({
    description: 'Monto de la transacción',
    example: 750.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Descripción de la transacción',
    example: 'Transferencia actualizada',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha de la transacción',
    example: '2024-01-20T00:00:00.000Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}

