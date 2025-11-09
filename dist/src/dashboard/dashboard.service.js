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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const accounts_service_1 = require("../accounts/accounts.service");
const credit_cards_service_1 = require("../credit-cards/credit-cards.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    accountsService;
    creditCardsService;
    constructor(prisma, accountsService, creditCardsService) {
        this.prisma = prisma;
        this.accountsService = accountsService;
        this.creditCardsService = creditCardsService;
    }
    async getDashboard() {
        const accounts = await this.prisma.account.findMany({
            where: {
                type: {
                    not: client_1.AccountType.CREDIT_CARD,
                },
                deletedAt: null,
            },
        });
        let totalBalance = 0;
        const accountsSummary = await Promise.all(accounts.map(async (account) => {
            const balance = await this.accountsService.calculateBalance(account.id);
            totalBalance += balance;
            return {
                id: account.id,
                name: account.name,
                type: account.type,
                balance: Number(balance),
            };
        }));
        const activeBudgets = await this.prisma.budget.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            include: {
                expenseType: true,
            },
        });
        let totalBudgetsAmount = 0;
        const budgetsSummary = activeBudgets.map((budget) => {
            const biweeklyAmount = Number(budget.biweeklyAmount);
            totalBudgetsAmount += biweeklyAmount;
            return {
                id: budget.id,
                expenseTypeName: budget.expenseType.name,
                biweeklyAmount,
                startDate: budget.startDate,
                endDate: budget.endDate,
            };
        });
        const creditCards = await this.prisma.account.findMany({
            where: {
                type: client_1.AccountType.CREDIT_CARD,
                deletedAt: null,
            },
        });
        let totalCreditCardDebt = 0;
        const creditCardsSummary = await Promise.all(creditCards.map(async (creditCard) => {
            const debt = await this.creditCardsService.getDebt(creditCard.id);
            totalCreditCardDebt += debt;
            return {
                id: creditCard.id,
                name: creditCard.name,
                debt: Number(debt),
            };
        }));
        const availableMoney = totalBalance - totalBudgetsAmount - totalCreditCardDebt;
        return {
            availableMoney: Number(availableMoney.toFixed(2)),
            totalBalance: Number(totalBalance.toFixed(2)),
            totalBudgetsAmount: Number(totalBudgetsAmount.toFixed(2)),
            totalCreditCardDebt: Number(totalCreditCardDebt.toFixed(2)),
            accounts: accountsSummary,
            activeBudgets: budgetsSummary,
            creditCards: creditCardsSummary,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        accounts_service_1.AccountsService,
        credit_cards_service_1.CreditCardsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map