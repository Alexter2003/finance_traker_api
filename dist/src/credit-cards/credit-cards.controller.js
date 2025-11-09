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
exports.CreditCardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const credit_cards_service_1 = require("./credit-cards.service");
const create_credit_card_dto_1 = require("./dto/create-credit-card.dto");
const update_credit_card_dto_1 = require("./dto/update-credit-card.dto");
const query_credit_card_dto_1 = require("./dto/query-credit-card.dto");
let CreditCardsController = class CreditCardsController {
    creditCardsService;
    constructor(creditCardsService) {
        this.creditCardsService = creditCardsService;
    }
    create(createCreditCardDto) {
        return this.creditCardsService.create(createCreditCardDto);
    }
    findAll(queryDto) {
        return this.creditCardsService.findAll(queryDto);
    }
    findOne(id) {
        return this.creditCardsService.findOne(id);
    }
    update(id, updateCreditCardDto) {
        return this.creditCardsService.update(id, updateCreditCardDto);
    }
    remove(id) {
        return this.creditCardsService.remove(id);
    }
};
exports.CreditCardsController = CreditCardsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva tarjeta de crédito' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tarjeta de crédito creada exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe una tarjeta de crédito con ese nombre',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_credit_card_dto_1.CreateCreditCardDto]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las tarjetas de crédito' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de tarjetas de crédito obtenida exitosamente',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_credit_card_dto_1.QueryCreditCardDto]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una tarjeta de crédito por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID de la tarjeta de crédito',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tarjeta de crédito encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tarjeta de crédito no encontrada',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una tarjeta de crédito' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID de la tarjeta de crédito',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tarjeta de crédito actualizada exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tarjeta de crédito no encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe una tarjeta de crédito con ese nombre',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_credit_card_dto_1.UpdateCreditCardDto]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una tarjeta de crédito' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID de la tarjeta de crédito',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Tarjeta de crédito eliminada exitosamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tarjeta de crédito no encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'No se puede eliminar porque tiene ingresos, gastos, transacciones o ajustes asociados',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CreditCardsController.prototype, "remove", null);
exports.CreditCardsController = CreditCardsController = __decorate([
    (0, swagger_1.ApiTags)('credit-cards'),
    (0, common_1.Controller)('credit-cards'),
    __metadata("design:paramtypes", [credit_cards_service_1.CreditCardsService])
], CreditCardsController);
//# sourceMappingURL=credit-cards.controller.js.map