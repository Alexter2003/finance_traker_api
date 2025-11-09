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
exports.AccountAdjustmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const account_adjustments_service_1 = require("./account-adjustments.service");
const create_account_adjustment_dto_1 = require("./dto/create-account-adjustment.dto");
const update_account_adjustment_dto_1 = require("./dto/update-account-adjustment.dto");
const query_account_adjustment_dto_1 = require("./dto/query-account-adjustment.dto");
let AccountAdjustmentsController = class AccountAdjustmentsController {
    accountAdjustmentsService;
    constructor(accountAdjustmentsService) {
        this.accountAdjustmentsService = accountAdjustmentsService;
    }
    create(createAccountAdjustmentDto) {
        return this.accountAdjustmentsService.create(createAccountAdjustmentDto);
    }
    findAll(query) {
        return this.accountAdjustmentsService.findAll(query);
    }
    findOne(id) {
        return this.accountAdjustmentsService.findOne(id);
    }
    update(id, updateAccountAdjustmentDto) {
        return this.accountAdjustmentsService.update(id, updateAccountAdjustmentDto);
    }
    remove(id) {
        return this.accountAdjustmentsService.remove(id);
    }
};
exports.AccountAdjustmentsController = AccountAdjustmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo ajuste de cuenta' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ajuste de cuenta creado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Error en la solicitud',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Cuenta no encontrada',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_adjustment_dto_1.CreateAccountAdjustmentDto]),
    __metadata("design:returntype", void 0)
], AccountAdjustmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener todos los ajustes de cuenta con filtros opcionales',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de ajustes de cuenta obtenida exitosamente',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_account_adjustment_dto_1.QueryAccountAdjustmentDto]),
    __metadata("design:returntype", void 0)
], AccountAdjustmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un ajuste de cuenta por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID del ajuste de cuenta',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ajuste de cuenta encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ajuste de cuenta no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccountAdjustmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un ajuste de cuenta' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID del ajuste de cuenta',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ajuste de cuenta actualizado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Error en la solicitud',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ajuste de cuenta o cuenta no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_account_adjustment_dto_1.UpdateAccountAdjustmentDto]),
    __metadata("design:returntype", void 0)
], AccountAdjustmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un ajuste de cuenta (soft delete)' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID del ajuste de cuenta',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Ajuste de cuenta eliminado exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ajuste de cuenta no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AccountAdjustmentsController.prototype, "remove", null);
exports.AccountAdjustmentsController = AccountAdjustmentsController = __decorate([
    (0, swagger_1.ApiTags)('account-adjustments'),
    (0, common_1.Controller)('account-adjustments'),
    __metadata("design:paramtypes", [account_adjustments_service_1.AccountAdjustmentsService])
], AccountAdjustmentsController);
//# sourceMappingURL=account-adjustments.controller.js.map