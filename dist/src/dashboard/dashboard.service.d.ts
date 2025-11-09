import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreditCardsService } from '../credit-cards/credit-cards.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly accountsService;
    private readonly creditCardsService;
    constructor(prisma: PrismaService, accountsService: AccountsService, creditCardsService: CreditCardsService);
    getDashboard(): Promise<{
        availableMoney: number;
        totalBalance: number;
        totalBudgetsAmount: number;
        totalCreditCardDebt: number;
        accounts: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            balance: number;
        }[];
        activeBudgets: {
            id: number;
            expenseTypeName: string;
            biweeklyAmount: number;
            startDate: Date;
            endDate: Date;
        }[];
        creditCards: {
            id: number;
            name: string;
            debt: number;
        }[];
    }>;
}
