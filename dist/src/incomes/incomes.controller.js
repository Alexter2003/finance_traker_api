"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const incomes_service_1 = require("./incomes.service");
const create_income_dto_1 = require("./dto/create-income.dto");
const update_income_dto_1 = require("./dto/update-income.dto");
const income_query_dto_1 = require("./dto/income-query.dto");
let IncomesController = class IncomesController {
    incomesService;
    constructor(incomesService) {
        this.incomesService = incomesService;
    }
    create(createIncomeDto) {
        return this.incomesService.create(createIncomeDto);
    }
    findAll(query) {
        return this.incomesService.findAll(query);
    }
    findOne(id) {
        return this.incomesService.findOne(id);
    }
    update(id, updateIncomeDto) {
        return this.incomesService.update(id, updateIncomeDto);
    }
    remove(id) {
        return this.incomesService.remove(id);
    }
};
exports.IncomesController = IncomesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo ingreso' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ingreso creado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Solicitud inválida',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Cuenta no encontrada',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_income_dto_1.CreateIncomeDto]),
    __metadata("design:returntype", void 0)
], IncomesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los ingresos con filtros opcionales' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de ingresos obtenida exitosamente',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [income_query_dto_1.IncomeQueryDto]),
    __metadata("design:returntype", void 0)
], IncomesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un ingreso por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID del ingreso',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ingreso obtenido exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ingreso no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IncomesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un ingreso' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID del ingreso',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ingreso actualizado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Solicitud inválida',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ingreso o cuenta no encontrados',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_income_dto_1.UpdateIncomeDto]),
    __metadata("design:returntype", void 0)
], IncomesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un ingreso (soft delete)' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID del ingreso',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Ingreso eliminado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ingreso no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IncomesController.prototype, "remove", null);
exports.IncomesController = IncomesController = __decorate([
    (0, swagger_1.ApiTags)('incomes'),
    (0, common_1.Controller)('incomes'),
    __metadata("design:paramtypes", [incomes_service_1.IncomesService])
], IncomesController);
//# sourceMappingURL=incomes.controller.js.map