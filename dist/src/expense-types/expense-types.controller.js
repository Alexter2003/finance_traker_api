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
exports.ExpenseTypesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const expense_types_service_1 = require("./expense-types.service");
const create_expense_type_dto_1 = require("./dto/create-expense-type.dto");
const update_expense_type_dto_1 = require("./dto/update-expense-type.dto");
const query_expense_type_dto_1 = require("./dto/query-expense-type.dto");
let ExpenseTypesController = class ExpenseTypesController {
    expenseTypesService;
    constructor(expenseTypesService) {
        this.expenseTypesService = expenseTypesService;
    }
    create(createExpenseTypeDto) {
        return this.expenseTypesService.create(createExpenseTypeDto);
    }
    findAll(queryDto) {
        return this.expenseTypesService.findAll(queryDto);
    }
    findOne(id) {
        return this.expenseTypesService.findOne(id);
    }
    update(id, updateExpenseTypeDto) {
        return this.expenseTypesService.update(id, updateExpenseTypeDto);
    }
    remove(id) {
        return this.expenseTypesService.remove(id);
    }
};
exports.ExpenseTypesController = ExpenseTypesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo tipo de gasto' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tipo de gasto creado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un tipo de gasto con ese nombre',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_type_dto_1.CreateExpenseTypeDto]),
    __metadata("design:returntype", void 0)
], ExpenseTypesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los tipos de gasto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de tipos de gasto obtenida exitosamente',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_expense_type_dto_1.QueryExpenseTypeDto]),
    __metadata("design:returntype", void 0)
], ExpenseTypesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un tipo de gasto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del tipo de gasto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tipo de gasto encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tipo de gasto no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExpenseTypesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un tipo de gasto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del tipo de gasto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tipo de gasto actualizado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tipo de gasto no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe un tipo de gasto con ese nombre',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_expense_type_dto_1.UpdateExpenseTypeDto]),
    __metadata("design:returntype", void 0)
], ExpenseTypesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un tipo de gasto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del tipo de gasto' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Tipo de gasto eliminado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tipo de gasto no encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'No se puede eliminar porque tiene gastos o presupuestos asociados',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExpenseTypesController.prototype, "remove", null);
exports.ExpenseTypesController = ExpenseTypesController = __decorate([
    (0, swagger_1.ApiTags)('expense-types'),
    (0, common_1.Controller)('expense-types'),
    __metadata("design:paramtypes", [expense_types_service_1.ExpenseTypesService])
], ExpenseTypesController);
//# sourceMappingURL=expense-types.controller.js.map