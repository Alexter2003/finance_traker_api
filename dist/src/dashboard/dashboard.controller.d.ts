import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
