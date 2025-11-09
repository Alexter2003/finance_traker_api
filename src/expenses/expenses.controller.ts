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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';

@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gasto' })
  @ApiResponse({
    status: 201,
    description: 'Gasto creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta o tipo de gasto no encontrado',
  })
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gastos con filtros opcionales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gastos obtenida exitosamente',
  })
  findAll(@Query() query: ExpenseQueryDto) {
    return this.expensesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del gasto',
  })
  @ApiResponse({
    status: 200,
    description: 'Gasto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Gasto no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gasto' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del gasto',
  })
  @ApiResponse({
    status: 200,
    description: 'Gasto actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Gasto, cuenta o tipo de gasto no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un gasto (soft delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del gasto',
  })
  @ApiResponse({
    status: 204,
    description: 'Gasto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Gasto no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(id);
  }
}
