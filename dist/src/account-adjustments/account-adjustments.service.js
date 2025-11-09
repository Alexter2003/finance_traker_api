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
exports.AccountAdjustmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountAdjustmentsService = class AccountAdjustmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAccountAdjustmentDto) {
        try {
            const account = await this.prisma.account.findFirst({
                where: {
                    id: createAccountAdjustmentDto.accountId,
                    deletedAt: null,
                },
            });
            if (!account) {
                throw new common_1.NotFoundException(`Cuenta con ID ${createAccountAdjustmentDto.accountId} no encontrada`);
            }
            return await this.prisma.accountAdjustment.create({
                data: {
                    accountId: createAccountAdjustmentDto.accountId,
                    amount: createAccountAdjustmentDto.amount,
                    reason: createAccountAdjustmentDto.reason,
                    date: new Date(createAccountAdjustmentDto.date),
                },
                include: {
                    account: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error al crear el ajuste de cuenta');
        }
    }
    async findAll(query) {
        const { accountId, startDate, endDate, page = 1, limit = 10, } = query;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(accountId && { accountId }),
            ...(startDate || endDate
                ? {
                    date: {
                        ...(startDate && { gte: new Date(startDate) }),
                        ...(endDate && { lte: new Date(endDate) }),
                    },
                }
                : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.accountAdjustment.findMany({
                where,
                skip,
                take: limit,
                include: {
                    account: true,
                },
                orderBy: {
                    date: 'desc',
                },
            }),
            this.prisma.accountAdjustment.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const adjustment = await this.prisma.accountAdjustment.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                account: true,
            },
        });
        if (!adjustment) {
            throw new common_1.NotFoundException(`Ajuste de cuenta con ID ${id} no encontrado`);
        }
        return adjustment;
    }
    async update(id, updateAccountAdjustmentDto) {
        const existingAdjustment = await this.findOne(id);
        if (updateAccountAdjustmentDto.accountId) {
            const account = await this.prisma.account.findFirst({
                where: {
                    id: updateAccountAdjustmentDto.accountId,
                    deletedAt: null,
                },
            });
            if (!account) {
                throw new common_1.NotFoundException(`Cuenta con ID ${updateAccountAdjustmentDto.accountId} no encontrada`);
            }
        }
        try {
            return await this.prisma.accountAdjustment.update({
                where: { id },
                data: {
                    ...(updateAccountAdjustmentDto.accountId && {
                        accountId: updateAccountAdjustmentDto.accountId,
                    }),
                    ...(updateAccountAdjustmentDto.amount !== undefined && {
                        amount: updateAccountAdjustmentDto.amount,
                    }),
                    ...(updateAccountAdjustmentDto.reason && {
                        reason: updateAccountAdjustmentDto.reason,
                    }),
                    ...(updateAccountAdjustmentDto.date && {
                        date: new Date(updateAccountAdjustmentDto.date),
                    }),
                },
                include: {
                    account: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error al actualizar el ajuste de cuenta');
        }
    }
    async remove(id) {
        await this.findOne(id);
        return await this.prisma.accountAdjustment.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.AccountAdjustmentsService = AccountAdjustmentsService;
exports.AccountAdjustmentsService = AccountAdjustmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountAdjustmentsService);
//# sourceMappingURL=account-adjustments.service.js.map