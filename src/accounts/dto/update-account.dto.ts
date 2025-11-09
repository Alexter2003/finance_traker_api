import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType } from '@prisma/client';

export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'Nombre de la cuenta',
    example: 'Cuenta Principal Actualizada',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Tipo de cuenta',
    enum: AccountType,
    example: AccountType.SAVINGS,
  })
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @ApiPropertyOptional({
    description: 'Balance inicial de la cuenta',
    example: 1500.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  initialBalance?: number;
}

