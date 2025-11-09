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
exports.BudgetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const budgets_service_1 = require("./budgets.service");
const create_budget_dto_1 = require("./dto/create-budget.dto");
const update_budget_dto_1 = require("./dto/update-budget.dto");
const query_budget_dto_1 = require("./dto/query-budget.dto");
let BudgetsController = class BudgetsController {
    budgetsService;
    constructor(budgetsService) {
        this.budgetsService = budgetsService;
    }
    create(createBudgetDto) {
        return this.budgetsService.create(createBudgetDto);
    }
    findAll(queryDto) {
        return this.budgetsService.findAll(queryDto);
    }
    findOne(id) {
        return this.budgetsService.findOne(id);
    }
    update(id, updateBudgetDto) {
        return this.budgetsService.update(id, updateBudgetDto);
    }
    remove(id) {
        return this.budgetsService.remove(id);
    }
};
exports.BudgetsController = BudgetsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo presupuesto quincenal' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Presupuesto creado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Error de validación: tipo de gasto no es FIXED, fechas inválidas, etc.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tipo de gasto no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un presupuesto activo para este tipo de gasto en el período especificado',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_budget_dto_1.CreateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los presupuestos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de presupuestos obtenida exitosamente',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_budget_dto_1.QueryBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un presupuesto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del presupuesto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presupuesto encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Presupuesto no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un presupuesto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del presupuesto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Presupuesto actualizado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Error de validación: fechas inválidas, etc.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Presupuesto no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe otro presupuesto activo para este tipo de gasto en el período especificado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_budget_dto_1.UpdateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un presupuesto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del presupuesto' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Presupuesto eliminado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Presupuesto no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BudgetsController.prototype, "remove", null);
exports.BudgetsController = BudgetsController = __decorate([
    (0, swagger_1.ApiTags)('budgets'),
    (0, common_1.Controller)('budgets'),
    __metadata("design:paramtypes", [budgets_service_1.BudgetsService])
], BudgetsController);
//# sourceMappingURL=budgets.controller.js.map