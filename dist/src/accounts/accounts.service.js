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
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountsService = class AccountsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateBalance(accountId) {
        const [incomesSum, expensesSum, transactionsReceivedSum, transactionsSentSum, adjustmentsSum,] = await Promise.all([
            this.prisma.income.aggregate({
                where: {
                    accountId,
                    deletedAt: null,
                },
                _sum: {
                    amount: true,
                },
            }),
            this.prisma.expense.aggregate({
                where: {
                    accountId,
                    deletedAt: null,
                },
                _sum: {
                    amount: true,
                },
            }),
            this.prisma.transaction.aggregate({
                where: {
                    toAccountId: accountId,
                    deletedAt: null,
                },
                _sum: {
                    amount: true,
                },
            }),
            this.prisma.transaction.aggregate({
                where: {
                    fromAccountId: accountId,
                    deletedAt: null,
                },
                _sum: {
                    amount: true,
                },
            }),
            this.prisma.accountAdjustment.aggregate({
                where: {
                    accountId,
                    deletedAt: null,
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);
        const initialBalance = (await this.prisma.account.findUnique({
            where: { id: accountId },
            select: { initialBalance: true },
        }))?.initialBalance || 0;
        const balance = Number(initialBalance) +
            Number(incomesSum._sum.amount || 0) -
            Number(expensesSum._sum.amount || 0) +
            Number(transactionsReceivedSum._sum.amount || 0) -
            Number(transactionsSentSum._sum.amount || 0) +
            Number(adjustmentsSum._sum.amount || 0);
        return balance;
    }
    async create(createAccountDto) {
        const existingAccount = await this.prisma.account.findFirst({
            where: {
                name: createAccountDto.name,
                deletedAt: null,
            },
        });
        if (existingAccount) {
            throw new common_1.ConflictException(`Ya existe una cuenta con el nombre "${createAccountDto.name}"`);
        }
        const account = await this.prisma.account.create({
            data: {
                name: createAccountDto.name,
                type: createAccountDto.type,
                initialBalance: createAccountDto.initialBalance,
            },
        });
        const balance = await this.calculateBalance(account.id);
        return {
            ...account,
            balance,
        };
    }
    async findAll(queryDto) {
        const { type, search, page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (type) {
            where.type = type;
        }
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }
        const [accounts, total] = await Promise.all([
            this.prisma.account.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.account.count({ where }),
        ]);
        const data = await Promise.all(accounts.map(async (account) => {
            const balance = await this.calculateBalance(account.id);
            return {
                ...account,
                balance,
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
        const account = await this.prisma.account.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!account) {
            throw new common_1.NotFoundException(`Cuenta con ID ${id} no encontrada`);
        }
        const balance = await this.calculateBalance(id);
        return {
            ...account,
            balance,
        };
    }
    async update(id, updateAccountDto) {
        await this.findOne(id);
        if (updateAccountDto.name) {
            const existingAccount = await this.prisma.account.findFirst({
                where: {
                    name: updateAccountDto.name,
                    deletedAt: null,
                    id: {
                        not: id,
                    },
                },
            });
            if (existingAccount) {
                throw new common_1.ConflictException(`Ya existe una cuenta con el nombre "${updateAccountDto.name}"`);
            }
        }
        const account = await this.prisma.account.update({
            where: { id },
            data: updateAccountDto,
        });
        const balance = await this.calculateBalance(id);
        return {
            ...account,
            balance,
        };
    }
    async remove(id) {
        await this.findOne(id);
        const hasIncomes = await this.prisma.income.count({
            where: {
                accountId: id,
                deletedAt: null,
            },
            take: 1,
        });
        const hasExpenses = await this.prisma.expense.count({
            where: {
                accountId: id,
                deletedAt: null,
            },
            take: 1,
        });
        const hasTransactionsFrom = await this.prisma.transaction.count({
            where: {
                fromAccountId: id,
                deletedAt: null,
            },
            take: 1,
        });
        const hasTransactionsTo = await this.prisma.transaction.count({
            where: {
                toAccountId: id,
                deletedAt: null,
            },
            take: 1,
        });
        const hasAdjustments = await this.prisma.accountAdjustment.count({
            where: {
                accountId: id,
                deletedAt: null,
            },
            take: 1,
        });
        if (hasIncomes ||
            hasExpenses ||
            hasTransactionsFrom ||
            hasTransactionsTo ||
            hasAdjustments) {
            throw new common_1.BadRequestException('No se puede eliminar una cuenta que tiene ingresos, gastos, transacciones o ajustes asociados');
        }
        return this.prisma.account.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map