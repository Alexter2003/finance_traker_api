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
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { QueryCreditCardDto } from './dto/query-credit-card.dto';

@ApiTags('credit-cards')
@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarjeta de crédito' })
  @ApiResponse({
    status: 201,
    description: 'Tarjeta de crédito creada exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una tarjeta de crédito con ese nombre',
  })
  create(@Body() createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardsService.create(createCreditCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarjetas de crédito' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarjetas de crédito obtenida exitosamente',
  })
  findAll(@Query() queryDto: QueryCreditCardDto) {
    return this.creditCardsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarjeta de crédito por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la tarjeta de crédito',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarjeta de crédito encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarjeta de crédito no encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.creditCardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarjeta de crédito' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la tarjeta de crédito',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarjeta de crédito actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarjeta de crédito no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una tarjeta de crédito con ese nombre',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardsService.update(id, updateCreditCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarjeta de crédito' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la tarjeta de crédito',
  })
  @ApiResponse({
    status: 204,
    description: 'Tarjeta de crédito eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarjeta de crédito no encontrada',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se puede eliminar porque tiene ingresos, gastos, transacciones o ajustes asociados',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.creditCardsService.remove(id);
  }
}
