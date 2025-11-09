import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @ApiProperty({
    description: 'Monto del gasto',
    example: 200.0,
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
    description: 'ID del tipo de gasto asociado',
    example: 1,
    required: false,
    type: Number,
  })
  expenseTypeId?: number;

  @ApiProperty({
    description: 'Descripción del gasto',
    example: 'Compra de supermercado actualizada',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Fecha del gasto',
    example: '2024-01-20T00:00:00.000Z',
    required: false,
    type: String,
  })
  date?: string;
}

