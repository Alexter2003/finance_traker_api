import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IncomeFrequency } from '@prisma/client';
import { CreateIncomeDto } from './create-income.dto';

export class UpdateIncomeDto extends PartialType(CreateIncomeDto) {
  @ApiProperty({
    description: 'Monto del ingreso',
    example: 5500.0,
    required: false,
    type: Number,
  })
  amount?: number;

  @ApiProperty({
    description: 'ID de la cuenta asociada',
    example: 1,
    required: false,
    type: Number,
  })
  accountId?: number;

  @ApiProperty({
    description: 'Frecuencia del ingreso',
    enum: IncomeFrequency,
    example: IncomeFrequency.RECURRENT_MONTHLY,
    required: false,
  })
  frequency?: IncomeFrequency;

  @ApiProperty({
    description: 'Descripción del ingreso',
    example: 'Salario mensual actualizado',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Fecha del ingreso',
    example: '2024-01-20T00:00:00.000Z',
    required: false,
    type: String,
  })
  date?: string;
}
