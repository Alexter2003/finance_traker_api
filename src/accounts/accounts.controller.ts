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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cuenta' })
  @ApiResponse({
    status: 201,
    description: 'Cuenta creada exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una cuenta con ese nombre',
  })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cuentas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuentas obtenida exitosamente',
  })
  findAll(@Query() queryDto: QueryAccountDto) {
    return this.accountsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cuenta por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({
    status: 200,
    description: 'Cuenta encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta no encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cuenta' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({
    status: 200,
    description: 'Cuenta actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una cuenta con ese nombre',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una cuenta' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({
    status: 204,
    description: 'Cuenta eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta no encontrada',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se puede eliminar porque tiene ingresos, gastos, transacciones o ajustes asociados',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.remove(id);
  }
}
