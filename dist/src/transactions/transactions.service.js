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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const accounts_service_1 = require("../accounts/accounts.service");
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    prisma;
    accountsService;
    constructor(prisma, accountsService) {
        this.prisma = prisma;
        this.accountsService = accountsService;
    }
    async create(createTransactionDto) {
        try {
            if (createTransactionDto.fromAccountId === createTransactionDto.toAccountId) {
                throw new common_1.BadRequestException('La cuenta de origen y destino no pueden ser la misma');
            }
            const fromAccount = await this.prisma.account.findFirst({
                where: {
                    id: createTransactionDto.fromAccountId,
                    deletedAt: null,
                },
            });
            if (!fromAccount) {
                throw new common_1.NotFoundException(`Cuenta de origen con ID ${createTransactionDto.fromAccountId} no encontrada`);
            }
            const toAccount = await this.prisma.account.findFirst({
                where: {
                    id: createTransactionDto.toAccountId,
                    deletedAt: null,
                },
            });
            if (!toAccount) {
                throw new common_1.NotFoundException(`Cuenta de destino con ID ${createTransactionDto.toAccountId} no encontrada`);
            }
            if (fromAccount.type !== client_1.AccountType.CREDIT_CARD) {
                const currentBalance = await this.accountsService.calculateBalance(createTransactionDto.fromAccountId);
                if (currentBalance < createTransactionDto.amount) {
                    throw new common_1.BadRequestException(`Saldo insuficiente. La cuenta "${fromAccount.name}" tiene un balance de $${currentBalance.toFixed(2)} y se intenta transferir $${createTransactionDto.amount.toFixed(2)}`);
                }
            }
            return await this.prisma.transaction.create({
                data: {
                    fromAccountId: createTransactionDto.fromAccountId,
                    toAccountId: createTransactionDto.toAccountId,
                    amount: createTransactionDto.amount,
                    description: createTransactionDto.description,
                    date: new Date(createTransactionDto.date),
                },
                include: {
                    fromAccount: true,
                    toAccount: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error al crear la transacción');
        }
    }
    async findAll(queryDto) {
        const { fromAccountId, toAccountId, startDate, endDate, page = 1, limit = 10, } = queryDto;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (fromAccountId) {
            where.fromAccountId = fromAccountId;
        }
        if (toAccountId) {
            where.toAccountId = toAccountId;
        }
        if (startDate || endDate) {
            where.date = {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
            };
        }
        const [data, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fromAccount: true,
                    toAccount: true,
                },
                orderBy: {
                    date: 'desc',
                },
            }),
            this.prisma.transaction.count({ where }),
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
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                fromAccount: true,
                toAccount: true,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transacción con ID ${id} no encontrada`);
        }
        return transaction;
    }
    async update(id, updateTransactionDto) {
        try {
            const existingTransaction = await this.prisma.transaction.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!existingTransaction) {
                throw new common_1.NotFoundException(`Transacción con ID ${id} no encontrada`);
            }
            if (updateTransactionDto.fromAccountId !== undefined &&
                updateTransactionDto.toAccountId !== undefined &&
                updateTransactionDto.fromAccountId === updateTransactionDto.toAccountId) {
                throw new common_1.BadRequestException('La cuenta de origen y destino no pueden ser la misma');
            }
            if (updateTransactionDto.fromAccountId !== undefined) {
                const fromAccount = await this.prisma.account.findFirst({
                    where: {
                        id: updateTransactionDto.fromAccountId,
                        deletedAt: null,
                    },
                });
                if (!fromAccount) {
                    throw new common_1.NotFoundException(`Cuenta de origen con ID ${updateTransactionDto.fromAccountId} no encontrada`);
                }
            }
            if (updateTransactionDto.toAccountId !== undefined) {
                const toAccount = await this.prisma.account.findFirst({
                    where: {
                        id: updateTransactionDto.toAccountId,
                        deletedAt: null,
                    },
                });
                if (!toAccount) {
                    throw new common_1.NotFoundException(`Cuenta de destino con ID ${updateTransactionDto.toAccountId} no encontrada`);
                }
            }
            if (updateTransactionDto.fromAccountId !== undefined &&
                updateTransactionDto.toAccountId === undefined) {
                const finalToAccountId = existingTransaction.toAccountId;
                if (updateTransactionDto.fromAccountId === finalToAccountId) {
                    throw new common_1.BadRequestException('La cuenta de origen y destino no pueden ser la misma');
                }
            }
            if (updateTransactionDto.toAccountId !== undefined &&
                updateTransactionDto.fromAccountId === undefined) {
                const finalFromAccountId = existingTransaction.fromAccountId;
                if (finalFromAccountId === updateTransactionDto.toAccountId) {
                    throw new common_1.BadRequestException('La cuenta de origen y destino no pueden ser la misma');
                }
            }
            const finalFromAccountId = updateTransactionDto.fromAccountId !== undefined
                ? updateTransactionDto.fromAccountId
                : existingTransaction.fromAccountId;
            const finalAmount = updateTransactionDto.amount !== undefined
                ? updateTransactionDto.amount
                : Number(existingTransaction.amount);
            if (updateTransactionDto.amount !== undefined ||
                updateTransactionDto.fromAccountId !== undefined) {
                const finalFromAccount = await this.prisma.account.findFirst({
                    where: {
                        id: finalFromAccountId,
                        deletedAt: null,
                    },
                });
                if (finalFromAccount &&
                    finalFromAccount.type !== client_1.AccountType.CREDIT_CARD) {
                    const currentBalance = await this.accountsService.calculateBalance(finalFromAccountId);
                    let balanceToCheck = currentBalance;
                    if (updateTransactionDto.fromAccountId === undefined &&
                        updateTransactionDto.amount !== undefined) {
                        balanceToCheck =
                            currentBalance - Number(existingTransaction.amount) + finalAmount;
                    }
                    else {
                        balanceToCheck = currentBalance;
                    }
                    if (balanceToCheck < finalAmount) {
                        throw new common_1.BadRequestException(`Saldo insuficiente. La cuenta "${finalFromAccount.name}" tiene un balance de $${currentBalance.toFixed(2)} y se intenta transferir $${finalAmount.toFixed(2)}`);
                    }
                }
            }
            return await this.prisma.transaction.update({
                where: { id },
                data: {
                    ...(updateTransactionDto.fromAccountId !== undefined && {
                        fromAccountId: updateTransactionDto.fromAccountId,
                    }),
                    ...(updateTransactionDto.toAccountId !== undefined && {
                        toAccountId: updateTransactionDto.toAccountId,
                    }),
                    ...(updateTransactionDto.amount !== undefined && {
                        amount: updateTransactionDto.amount,
                    }),
                    ...(updateTransactionDto.description !== undefined && {
                        description: updateTransactionDto.description,
                    }),
                    ...(updateTransactionDto.date !== undefined && {
                        date: new Date(updateTransactionDto.date),
                    }),
                },
                include: {
                    fromAccount: true,
                    toAccount: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error al actualizar la transacción');
        }
    }
    async remove(id) {
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transacción con ID ${id} no encontrada`);
        }
        return await this.prisma.transaction.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        accounts_service_1.AccountsService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map