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
exports.UpdateIncomeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const create_income_dto_1 = require("./create-income.dto");
class UpdateIncomeDto extends (0, swagger_2.PartialType)(create_income_dto_1.CreateIncomeDto) {
    amount;
    accountId;
    frequency;
    description;
    date;
}
exports.UpdateIncomeDto = UpdateIncomeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto del ingreso',
        example: 5500.0,
        required: false,
        type: Number,
    }),
    __metadata("design:type", Number)
], UpdateIncomeDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la cuenta asociada',
        example: 1,
        required: false,
        type: Number,
    }),
    __metadata("design:type", Number)
], UpdateIncomeDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Frecuencia del ingreso',
        enum: client_1.IncomeFrequency,
        example: client_1.IncomeFrequency.RECURRENT_MONTHLY,
        required: false,
    }),
    __metadata("design:type", String)
], UpdateIncomeDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del ingreso',
        example: 'Salario mensual actualizado',
        required: false,
        nullable: true,
    }),
    __metadata("design:type", String)
], UpdateIncomeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha del ingreso',
        example: '2024-01-20T00:00:00.000Z',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], UpdateIncomeDto.prototype, "date", void 0);
//# sourceMappingURL=update-income.dto.js.map