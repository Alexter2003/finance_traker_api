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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BudgetsService = class BudgetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hasActiveBudgetInPeriod(expenseTypeId, startDate, endDate, excludeId) {
        const existingBudget = await this.prisma.budget.findFirst({
            where: {
                expenseTypeId,
                isActive: true,
                deletedAt: null,
                id: excludeId ? { not: excludeId } : undefined,
                OR: [
                    {
                        AND: [
                            { startDate: { lte: endDate } },
                            { endDate: { gte: startDate } },
                        ],
                    },
                ],
            },
        });
        return !!existingBudget;
    }
    async calculateSpentAmount(budgetId) {
        const budget = await this.prisma.budget.findUnique({
            where: { id: budgetId },
            select: {
                expenseTypeId: true,
                startDate: true,
                endDate: true,
            },
        });
        if (!budget) {
            return 0;
        }
        const expensesSum = await this.prisma.expense.aggregate({
            where: {
                expenseTypeId: budget.expenseTypeId,
                deletedAt: null,
                date: {
                    gte: budget.startDate,
                    lte: budget.endDate,
                },
            },
            _sum: {
                amount: true,
            },
        });
        return Number(expensesSum._sum.amount || 0);
    }
    async getPreviousActiveBudget(expenseTypeId, startDate) {
        const previousBudget = await this.prisma.budget.findFirst({
            where: {
                expenseTypeId,
                isActive: true,
                deletedAt: null,
                endDate: { lt: startDate },
            },
            orderBy: {
                endDate: 'desc',
            },
            select: {
                id: true,
                biweeklyAmount: true,
                pendingAmount: true,
            },
        });
        if (!previousBudget) {
            return null;
        }
        const spentAmount = await this.calculateSpentAmount(previousBudget.id);
        const totalAvailable = Number(previousBudget.biweeklyAmount) +
            Number(previousBudget.pendingAmount);
        const remainingAmount = totalAvailable - spentAmount;
        return {
            pendingAmount: Math.max(0, remainingAmount),
        };
    }
    async create(createBudgetDto) {
        const expenseType = await this.prisma.expenseType.findFirst({
            where: {
                id: createBudgetDto.expenseTypeId,
                deletedAt: null,
            },
        });
        if (!expenseType) {
            throw new common_1.NotFoundException(`Tipo de gasto con ID ${createBudgetDto.expenseTypeId} no encontrado`);
        }
        if (expenseType.type !== client_1.ExpenseCategoryType.FIXED) {
            throw new common_1.BadRequestException('Los presupuestos solo pueden asignarse a tipos de gastos fijos (FIXED)');
        }
        const startDate = new Date(createBudgetDto.startDate);
        const endDate = new Date(createBudgetDto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
        }
        const hasActive = await this.hasActiveBudgetInPeriod(createBudgetDto.expenseTypeId, startDate, endDate);
        if (hasActive) {
            throw new common_1.ConflictException('Ya existe un presupuesto activo para este tipo de gasto en el período especificado');
        }
        const biweeklyAmount = createBudgetDto.biweeklyAmount ??
            createBudgetDto.monthlyAmount / 2;
        let pendingAmount = createBudgetDto.pendingAmount ?? 0;
        if (pendingAmount === 0) {
            const previousBudget = await this.getPreviousActiveBudget(createBudgetDto.expenseTypeId, startDate);
            if (previousBudget) {
                pendingAmount = previousBudget.pendingAmount;
            }
        }
        await this.prisma.budget.updateMany({
            where: {
                expenseTypeId: createBudgetDto.expenseTypeId,
                isActive: true,
                deletedAt: null,
            },
            data: {
                isActive: false,
            },
        });
        const budget = await this.prisma.budget.create({
            data: {
                expenseTypeId: createBudgetDto.expenseTypeId,
                monthlyAmount: createBudgetDto.monthlyAmount,
                biweeklyAmount,
                pendingAmount,
                startDate,
                endDate,
                isActive: true,
            },
            include: {
                expenseType: true,
            },
        });
        const spentAmount = await this.calculateSpentAmount(budget.id);
        const totalAvailable = Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
        const availableAmount = totalAvailable - spentAmount;
        return {
            ...budget,
            spentAmount,
            totalAvailable,
            availableAmount,
        };
    }
    async findAll(queryDto) {
        const { expenseTypeId, isActive, page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (expenseTypeId) {
            where.expenseTypeId = expenseTypeId;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        const [budgets, total] = await Promise.all([
            this.prisma.budget.findMany({
                where,
                skip,
                take: limit,
                include: {
                    expenseType: true,
                },
                orderBy: {
                    startDate: 'desc',
                },
            }),
            this.prisma.budget.count({ where }),
        ]);
        const data = await Promise.all(budgets.map(async (budget) => {
            const spentAmount = await this.calculateSpentAmount(budget.id);
            const totalAvailable = Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
            const availableAmount = totalAvailable - spentAmount;
            return {
                ...budget,
                spentAmount,
                totalAvailable,
                availableAmount,
            };
        }));
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
        const budget = await this.prisma.budget.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                expenseType: true,
            },
        });
        if (!budget) {
            throw new common_1.NotFoundException(`Presupuesto con ID ${id} no encontrado`);
        }
        const spentAmount = await this.calculateSpentAmount(id);
        const totalAvailable = Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
        const availableAmount = totalAvailable - spentAmount;
        return {
            ...budget,
            spentAmount,
            totalAvailable,
            availableAmount,
        };
    }
    async update(id, updateBudgetDto) {
        const existingBudget = await this.prisma.budget.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingBudget) {
            throw new common_1.NotFoundException(`Presupuesto con ID ${id} no encontrado`);
        }
        if (updateBudgetDto.startDate || updateBudgetDto.endDate) {
            const startDate = updateBudgetDto.startDate
                ? new Date(updateBudgetDto.startDate)
                : existingBudget.startDate;
            const endDate = updateBudgetDto.endDate
                ? new Date(updateBudgetDto.endDate)
                : existingBudget.endDate;
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
            }
            if (updateBudgetDto.isActive !== false &&
                (existingBudget.isActive || updateBudgetDto.isActive === true)) {
                const hasActive = await this.hasActiveBudgetInPeriod(existingBudget.expenseTypeId, startDate, endDate, id);
                if (hasActive) {
                    throw new common_1.ConflictException('Ya existe otro presupuesto activo para este tipo de gasto en el período especificado');
                }
            }
        }
        let biweeklyAmount = updateBudgetDto.biweeklyAmount;
        if (updateBudgetDto.monthlyAmount !== undefined &&
            updateBudgetDto.biweeklyAmount === undefined) {
            biweeklyAmount = updateBudgetDto.monthlyAmount / 2;
        }
        const updateData = {
            ...(updateBudgetDto.monthlyAmount !== undefined && {
                monthlyAmount: updateBudgetDto.monthlyAmount,
            }),
            ...(biweeklyAmount !== undefined && {
                biweeklyAmount,
            }),
            ...(updateBudgetDto.pendingAmount !== undefined && {
                pendingAmount: updateBudgetDto.pendingAmount,
            }),
            ...(updateBudgetDto.startDate !== undefined && {
                startDate: new Date(updateBudgetDto.startDate),
            }),
            ...(updateBudgetDto.endDate !== undefined && {
                endDate: new Date(updateBudgetDto.endDate),
            }),
            ...(updateBudgetDto.isActive !== undefined && {
                isActive: updateBudgetDto.isActive,
            }),
        };
        const budget = await this.prisma.budget.update({
            where: { id },
            data: updateData,
            include: {
                expenseType: true,
            },
        });
        const spentAmount = await this.calculateSpentAmount(id);
        const totalAvailable = Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
        const availableAmount = totalAvailable - spentAmount;
        return {
            ...budget,
            spentAmount,
            totalAvailable,
            availableAmount,
        };
    }
    async remove(id) {
        const budget = await this.prisma.budget.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!budget) {
            throw new common_1.NotFoundException(`Presupuesto con ID ${id} no encontrado`);
        }
        return this.prisma.budget.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map