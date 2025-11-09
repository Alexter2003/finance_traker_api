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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AccountAdjustmentsService } from './account-adjustments.service';
import { CreateAccountAdjustmentDto } from './dto/create-account-adjustment.dto';
import { UpdateAccountAdjustmentDto } from './dto/update-account-adjustment.dto';
import { QueryAccountAdjustmentDto } from './dto/query-account-adjustment.dto';

@ApiTags('account-adjustments')
@Controller('account-adjustments')
export class AccountAdjustmentsController {
  constructor(
    private readonly accountAdjustmentsService: AccountAdjustmentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ajuste de cuenta' })
  @ApiResponse({
    status: 201,
    description: 'Ajuste de cuenta creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta no encontrada',
  })
  create(@Body() createAccountAdjustmentDto: CreateAccountAdjustmentDto) {
    return this.accountAdjustmentsService.create(createAccountAdjustmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los ajustes de cuenta con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ajustes de cuenta obtenida exitosamente',
  })
  findAll(@Query() query: QueryAccountAdjustmentDto) {
    return this.accountAdjustmentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ajuste de cuenta por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del ajuste de cuenta',
  })
  @ApiResponse({
    status: 200,
    description: 'Ajuste de cuenta encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Ajuste de cuenta no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountAdjustmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ajuste de cuenta' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del ajuste de cuenta',
  })
  @ApiResponse({
    status: 200,
    description: 'Ajuste de cuenta actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Ajuste de cuenta o cuenta no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountAdjustmentDto: UpdateAccountAdjustmentDto,
  ) {
    return this.accountAdjustmentsService.update(
      id,
      updateAccountAdjustmentDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un ajuste de cuenta (soft delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del ajuste de cuenta',
  })
  @ApiResponse({
    status: 204,
    description: 'Ajuste de cuenta eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Ajuste de cuenta no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountAdjustmentsService.remove(id);
  }
}

