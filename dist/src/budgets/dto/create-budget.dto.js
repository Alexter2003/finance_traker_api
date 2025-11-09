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
exports.CreateBudgetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateBudgetDto {
    expenseTypeId;
    monthlyAmount;
    biweeklyAmount;
    pendingAmount;
    startDate;
    endDate;
}
exports.CreateBudgetDto = CreateBudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del tipo de gasto (debe ser tipo FIXED)',
        example: 1,
        type: Number,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "expenseTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto mensual total del presupuesto',
        example: 600.0,
        type: Number,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "monthlyAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Monto quincenal (si no se proporciona, se calcula como monthlyAmount / 2)',
        example: 300.0,
        type: Number,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "biweeklyAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Saldo pendiente del período anterior (por defecto 0 si es el primer presupuesto)',
        example: 50.0,
        type: Number,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "pendingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de inicio de la quincena',
        example: '2024-01-01T00:00:00Z',
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de fin de la quincena',
        example: '2024-01-15T23:59:59Z',
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "endDate", void 0);
//# sourceMappingURL=create-budget.dto.js.map