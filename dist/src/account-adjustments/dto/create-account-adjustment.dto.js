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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountAdjustmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateAccountAdjustmentDto {
    accountId;
    amount;
    reason;
    date;
}
exports.CreateAccountAdjustmentDto = CreateAccountAdjustmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la cuenta a ajustar',
        example: 1,
        type: Number,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAccountAdjustmentDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto del ajuste (positivo para aumentar, negativo para disminuir)',
        example: -50.0,
        type: Number,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateAccountAdjustmentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Razón del ajuste',
        example: 'Corrección de diferencia por error de registro',
        minLength: 1,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAccountAdjustmentDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha del ajuste',
        example: '2024-01-15T00:00:00.000Z',
        type: String,
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAccountAdjustmentDto.prototype, "date", void 0);
//# sourceMappingURL=create-account-adjustment.dto.js.map