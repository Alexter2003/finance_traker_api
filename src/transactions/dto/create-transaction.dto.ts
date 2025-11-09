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

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID de la cuenta de origen',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  fromAccountId: number;

  @ApiProperty({
    description: 'ID de la cuenta de destino',
    example: 2,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  toAccountId: number;

  @ApiProperty({
    description: 'Monto de la transacción',
    example: 500.0,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Descripción de la transacción',
    example: 'Transferencia entre cuentas',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Fecha de la transacción',
    example: '2024-01-15T00:00:00.000Z',
    type: String,
  })
  @IsDateString()
  date: string;
}

