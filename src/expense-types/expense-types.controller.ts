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
import { ExpenseTypesService } from './expense-types.service';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { QueryExpenseTypeDto } from './dto/query-expense-type.dto';

@ApiTags('expense-types')
@Controller('expense-types')
export class ExpenseTypesController {
  constructor(private readonly expenseTypesService: ExpenseTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de gasto' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de gasto creado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de gasto con ese nombre',
  })
  create(@Body() createExpenseTypeDto: CreateExpenseTypeDto) {
    return this.expenseTypesService.create(createExpenseTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de gasto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de gasto obtenida exitosamente',
  })
  findAll(@Query() queryDto: QueryExpenseTypeDto) {
    return this.expenseTypesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de gasto por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del tipo de gasto' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de gasto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de gasto no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expenseTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de gasto' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del tipo de gasto' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de gasto actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de gasto no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de gasto con ese nombre',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
  ) {
    return this.expenseTypesService.update(id, updateExpenseTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un tipo de gasto' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del tipo de gasto' })
  @ApiResponse({
    status: 204,
    description: 'Tipo de gasto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de gasto no encontrado',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se puede eliminar porque tiene gastos o presupuestos asociados',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expenseTypesService.remove(id);
  }
}
