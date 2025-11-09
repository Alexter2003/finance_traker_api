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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createExpenseDto) {
        try {
            const account = await this.prisma.account.findFirst({
                where: {
                    id: createExpenseDto.accountId,
                    deletedAt: null,
                },
            });
            if (!account) {
                throw new common_1.NotFoundException(`Cuenta con ID ${createExpenseDto.accountId} no encontrada`);
            }
            const expenseType = await this.prisma.expenseType.findFirst({
                where: {
                    id: createExpenseDto.expenseTypeId,
                    deletedAt: null,
                },
            });
            if (!expenseType) {
                throw new common_1.NotFoundException(`Tipo de gasto con ID ${createExpenseDto.expenseTypeId} no encontrado`);
            }
            return await this.prisma.expense.create({
                data: {
                    amount: createExpenseDto.amount,
                    accountId: createExpenseDto.accountId,
                    expenseTypeId: createExpenseDto.expenseTypeId,
                    description: createExpenseDto.description,
                    date: new Date(createExpenseDto.date),
                },
                include: {
                    account: true,
                    expenseType: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error al crear el gasto');
        }
    }
    async findAll(query) {
        const { accountId, expenseTypeId, startDate, endDate, page = 1, limit = 10, } = query;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(accountId && { accountId }),
            ...(expenseTypeId && { expenseTypeId }),
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
            this.prisma.expense.findMany({
                where,
                skip,
                take: limit,
                include: {
                    account: true,
                    expenseType: true,
                },
                orderBy: {
                    date: 'desc',
                },
            }),
            this.prisma.expense.count({ where }),
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
        const expense = await this.prisma.expense.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                account: true,
                expenseType: true,
            },
        });
        if (!expense) {
            throw new common_1.NotFoundException(`Gasto con ID ${id} no encontrado`);
        }
        return expense;
    }
    async update(id, updateExpenseDto) {
        try {
            const existingExpense = await this.prisma.expense.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!existingExpense) {
                throw new common_1.NotFoundException(`Gasto con ID ${id} no encontrado`);
            }
            if (updateExpenseDto.accountId) {
                const account = await this.prisma.account.findFirst({
                    where: {
                        id: updateExpenseDto.accountId,
                        deletedAt: null,
                    },
                });
                if (!account) {
                    throw new common_1.NotFoundException(`Cuenta con ID ${updateExpenseDto.accountId} no encontrada`);
                }
            }
            if (updateExpenseDto.expenseTypeId) {
                const expenseType = await this.prisma.expenseType.findFirst({
                    where: {
                        id: updateExpenseDto.expenseTypeId,
                        deletedAt: null,
                    },
                });
                if (!expenseType) {
                    throw new common_1.NotFoundException(`Tipo de gasto con ID ${updateExpenseDto.expenseTypeId} no encontrado`);
                }
            }
            return await this.prisma.expense.update({
                where: { id },
                data: {
                    ...(updateExpenseDto.amount !== undefined && {
                        amount: updateExpenseDto.amount,
                    }),
                    ...(updateExpenseDto.accountId !== undefined && {
                        accountId: updateExpenseDto.accountId,
                    }),
                    ...(updateExpenseDto.expenseTypeId !== undefined && {
                        expenseTypeId: updateExpenseDto.expenseTypeId,
                    }),
                    ...(updateExpenseDto.description !== undefined && {
                        description: updateExpenseDto.description,
                    }),
                    ...(updateExpenseDto.date !== undefined && {
                        date: new Date(updateExpenseDto.date),
                    }),
                },
                include: {
                    account: true,
                    expenseType: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error al actualizar el gasto');
        }
    }
    async remove(id) {
        const expense = await this.prisma.expense.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!expense) {
            throw new common_1.NotFoundException(`Gasto con ID ${id} no encontrado`);
        }
        return await this.prisma.expense.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map