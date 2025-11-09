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
exports.IncomesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IncomesService = class IncomesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createIncomeDto) {
        try {
            const account = await this.prisma.account.findFirst({
                where: {
                    id: createIncomeDto.accountId,
                    deletedAt: null,
                },
            });
            if (!account) {
                throw new common_1.NotFoundException(`Cuenta con ID ${createIncomeDto.accountId} no encontrada`);
            }
            return await this.prisma.income.create({
                data: {
                    amount: createIncomeDto.amount,
                    accountId: createIncomeDto.accountId,
                    frequency: createIncomeDto.frequency,
                    description: createIncomeDto.description,
                    date: new Date(createIncomeDto.date),
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
            throw new common_1.BadRequestException('Error al crear el ingreso');
        }
    }
    async findAll(query) {
        const { accountId, startDate, endDate, page = 1, limit = 10 } = query;
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
            this.prisma.income.findMany({
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
            this.prisma.income.count({ where }),
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
        const income = await this.prisma.income.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                account: true,
            },
        });
        if (!income) {
            throw new common_1.NotFoundException(`Ingreso con ID ${id} no encontrado`);
        }
        return income;
    }
    async update(id, updateIncomeDto) {
        try {
            const existingIncome = await this.prisma.income.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!existingIncome) {
                throw new common_1.NotFoundException(`Ingreso con ID ${id} no encontrado`);
            }
            if (updateIncomeDto.accountId) {
                const account = await this.prisma.account.findFirst({
                    where: {
                        id: updateIncomeDto.accountId,
                        deletedAt: null,
                    },
                });
                if (!account) {
                    throw new common_1.NotFoundException(`Cuenta con ID ${updateIncomeDto.accountId} no encontrada`);
                }
            }
            return await this.prisma.income.update({
                where: { id },
                data: {
                    ...(updateIncomeDto.amount !== undefined && {
                        amount: updateIncomeDto.amount,
                    }),
                    ...(updateIncomeDto.accountId !== undefined && {
                        accountId: updateIncomeDto.accountId,
                    }),
                    ...(updateIncomeDto.frequency !== undefined && {
                        frequency: updateIncomeDto.frequency,
                    }),
                    ...(updateIncomeDto.description !== undefined && {
                        description: updateIncomeDto.description,
                    }),
                    ...(updateIncomeDto.date !== undefined && {
                        date: new Date(updateIncomeDto.date),
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
            throw new common_1.BadRequestException('Error al actualizar el ingreso');
        }
    }
    async remove(id) {
        const income = await this.prisma.income.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!income) {
            throw new common_1.NotFoundException(`Ingreso con ID ${id} no encontrado`);
        }
        return await this.prisma.income.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.IncomesService = IncomesService;
exports.IncomesService = IncomesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IncomesService);
//# sourceMappingURL=incomes.service.js.map