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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const update_transaction_dto_1 = require("./dto/update-transaction.dto");
const transaction_query_dto_1 = require("./dto/transaction-query.dto");
let TransactionsController = class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    create(createTransactionDto) {
        return this.transactionsService.create(createTransactionDto);
    }
    findAll(queryDto) {
        return this.transactionsService.findAll(queryDto);
    }
    findOne(id) {
        return this.transactionsService.findOne(id);
    }
    update(id, updateTransactionDto) {
        return this.transactionsService.update(id, updateTransactionDto);
    }
    remove(id) {
        return this.transactionsService.remove(id);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva transacción' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transacción creada exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos inválidos o cuenta de origen y destino son la misma',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Cuenta de origen o destino no encontrada',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener todas las transacciones con filtros opcionales',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de transacciones obtenida exitosamente',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_query_dto_1.TransactionQueryDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una transacción por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID de la transacción',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transacción encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Transacción no encontrada',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una transacción' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID de la transacción',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transacción actualizada exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos inválidos o cuenta de origen y destino son la misma',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Transacción o cuenta no encontrada',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una transacción (soft delete)' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID de la transacción',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Transacción eliminada exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Transacción no encontrada',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "remove", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('transactions'),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map