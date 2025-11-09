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
exports.CreditCardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const accounts_service_1 = require("../accounts/accounts.service");
const client_1 = require("@prisma/client");
let CreditCardsService = class CreditCardsService {
    prisma;
    accountsService;
    constructor(prisma, accountsService) {
        this.prisma = prisma;
        this.accountsService = accountsService;
    }
    async calculateBalance(creditCardId) {
        return this.accountsService.calculateBalance(creditCardId);
    }
    async getDebt(creditCardId) {
        const balance = await this.calculateBalance(creditCardId);
        return balance < 0 ? Math.abs(balance) : 0;
    }
    async create(createCreditCardDto) {
        const existingCreditCard = await this.prisma.account.findFirst({
            where: {
                name: createCreditCardDto.name,
                type: client_1.AccountType.CREDIT_CARD,
                deletedAt: null,
            },
        });
        if (existingCreditCard) {
            throw new common_1.ConflictException(`Ya existe una tarjeta de crédito con el nombre "${createCreditCardDto.name}"`);
        }
        const creditCard = await this.prisma.account.create({
            data: {
                name: createCreditCardDto.name,
                type: client_1.AccountType.CREDIT_CARD,
                initialBalance: createCreditCardDto.initialBalance,
            },
        });
        const balance = await this.calculateBalance(creditCard.id);
        const debt = await this.getDebt(creditCard.id);
        return {
            ...creditCard,
            balance,
            debt,
        };
    }
    async findAll(queryDto) {
        const { search, page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;
        const where = {
            type: client_1.AccountType.CREDIT_CARD,
            deletedAt: null,
        };
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }
        const [creditCards, total] = await Promise.all([
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
        const data = await Promise.all(creditCards.map(async (creditCard) => {
            const balance = await this.calculateBalance(creditCard.id);
            const debt = await this.getDebt(creditCard.id);
            return {
                ...creditCard,
                balance,
                debt,
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
        const creditCard = await this.prisma.account.findFirst({
            where: {
                id,
                type: client_1.AccountType.CREDIT_CARD,
                deletedAt: null,
            },
        });
        if (!creditCard) {
            throw new common_1.NotFoundException(`Tarjeta de crédito con ID ${id} no encontrada`);
        }
        const balance = await this.calculateBalance(id);
        const debt = await this.getDebt(id);
        return {
            ...creditCard,
            balance,
            debt,
        };
    }
    async update(id, updateCreditCardDto) {
        await this.findOne(id);
        if (updateCreditCardDto.name) {
            const existingCreditCard = await this.prisma.account.findFirst({
                where: {
                    name: updateCreditCardDto.name,
                    type: client_1.AccountType.CREDIT_CARD,
                    deletedAt: null,
                    id: {
                        not: id,
                    },
                },
            });
            if (existingCreditCard) {
                throw new common_1.ConflictException(`Ya existe una tarjeta de crédito con el nombre "${updateCreditCardDto.name}"`);
            }
        }
        const creditCard = await this.prisma.account.update({
            where: { id },
            data: updateCreditCardDto,
        });
        const balance = await this.calculateBalance(id);
        const debt = await this.getDebt(id);
        return {
            ...creditCard,
            balance,
            debt,
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
            throw new common_1.BadRequestException('No se puede eliminar una tarjeta de crédito que tiene ingresos, gastos, transacciones o ajustes asociados');
        }
        return this.prisma.account.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.CreditCardsService = CreditCardsService;
exports.CreditCardsService = CreditCardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        accounts_service_1.AccountsService])
], CreditCardsService);
//# sourceMappingURL=credit-cards.service.js.map