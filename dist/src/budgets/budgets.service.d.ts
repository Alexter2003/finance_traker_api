import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { QueryBudgetDto } from './dto/query-budget.dto';
import { Prisma } from '@prisma/client';
export declare class BudgetsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private hasActiveBudgetInPeriod;
    calculateSpentAmount(budgetId: number): Promise<number>;
    private getPreviousActiveBudget;
    create(createBudgetDto: CreateBudgetDto): Promise<{
        spentAmount: number;
        totalAvailable: number;
        availableAmount: number;
        expenseType: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.ExpenseCategoryType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expenseTypeId: number;
        startDate: Date;
        endDate: Date;
        monthlyAmount: Prisma.Decimal;
        biweeklyAmount: Prisma.Decimal;
        pendingAmount: Prisma.Decimal;
        isActive: boolean;
    }>;
    findAll(queryDto: QueryBudgetDto): Promise<{
        data: {
            spentAmount: number;
            totalAvailable: number;
            availableAmount: number;
            expenseType: {
                id: number;
                name: string;
                type: import("@prisma/client").$Enums.ExpenseCategoryType;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            expenseTypeId: number;
            startDate: Date;
            endDate: Date;
            monthlyAmount: Prisma.Decimal;
            biweeklyAmount: Prisma.Decimal;
            pendingAmount: Prisma.Decimal;
            isActive: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        spentAmount: number;
        totalAvailable: number;
        availableAmount: number;
        expenseType: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.ExpenseCategoryType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expenseTypeId: number;
        startDate: Date;
        endDate: Date;
        monthlyAmount: Prisma.Decimal;
        biweeklyAmount: Prisma.Decimal;
        pendingAmount: Prisma.Decimal;
        isActive: boolean;
    }>;
    update(id: number, updateBudgetDto: UpdateBudgetDto): Promise<{
        spentAmount: number;
        totalAvailable: number;
        availableAmount: number;
        expenseType: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.ExpenseCategoryType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expenseTypeId: number;
        startDate: Date;
        endDate: Date;
        monthlyAmount: Prisma.Decimal;
        biweeklyAmount: Prisma.Decimal;
        pendingAmount: Prisma.Decimal;
        isActive: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expenseTypeId: number;
        startDate: Date;
        endDate: Date;
        monthlyAmount: Prisma.Decimal;
        biweeklyAmount: Prisma.Decimal;
        pendingAmount: Prisma.Decimal;
        isActive: boolean;
    }>;
}
