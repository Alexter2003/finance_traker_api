import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o cuenta de origen y destino son la misma',
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta de origen o destino no encontrada',
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las transacciones con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de transacciones obtenida exitosamente',
  })
  findAll(@Query() queryDto: TransactionQueryDto) {
    return this.transactionsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la transacción',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Transacción no encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una transacción' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la transacción',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción actualizada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o cuenta de origen y destino son la misma',
  })
  @ApiResponse({
    status: 404,
    description: 'Transacción o cuenta no encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una transacción (soft delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la transacción',
  })
  @ApiResponse({
    status: 204,
    description: 'Transacción eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Transacción no encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(id);
  }
}
