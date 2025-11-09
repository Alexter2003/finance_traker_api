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
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { QueryBudgetDto } from './dto/query-budget.dto';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo presupuesto quincenal' })
  @ApiResponse({
    status: 201,
    description: 'Presupuesto creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'Error de validación: tipo de gasto no es FIXED, fechas inválidas, etc.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de gasto no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe un presupuesto activo para este tipo de gasto en el período especificado',
  })
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los presupuestos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de presupuestos obtenida exitosamente',
  })
  findAll(@Query() queryDto: QueryBudgetDto) {
    return this.budgetsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un presupuesto por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del presupuesto' })
  @ApiResponse({
    status: 200,
    description: 'Presupuesto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Presupuesto no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un presupuesto' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del presupuesto' })
  @ApiResponse({
    status: 200,
    description: 'Presupuesto actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación: fechas inválidas, etc.',
  })
  @ApiResponse({
    status: 404,
    description: 'Presupuesto no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe otro presupuesto activo para este tipo de gasto en el período especificado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un presupuesto' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del presupuesto' })
  @ApiResponse({
    status: 204,
    description: 'Presupuesto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Presupuesto no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsService.remove(id);
  }
}
