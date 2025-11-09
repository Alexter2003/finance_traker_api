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
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeQueryDto } from './dto/income-query.dto';

@ApiTags('incomes')
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ingreso' })
  @ApiResponse({
    status: 201,
    description: 'Ingreso creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud inválida',
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta no encontrada',
  })
  create(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomesService.create(createIncomeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ingresos con filtros opcionales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ingresos obtenida exitosamente',
  })
  findAll(@Query() query: IncomeQueryDto) {
    return this.incomesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ingreso por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del ingreso',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingreso obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingreso no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.incomesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ingreso' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del ingreso',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingreso actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud inválida',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingreso o cuenta no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un ingreso (soft delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del ingreso',
  })
  @ApiResponse({
    status: 204,
    description: 'Ingreso eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingreso no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.incomesService.remove(id);
  }
}
