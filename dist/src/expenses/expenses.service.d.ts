import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';
import { Prisma } from '@prisma/client';
export declare class ExpensesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createExpenseDto: CreateExpenseDto): Promise<{
        expenseType: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.ExpenseCategoryType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        account: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: Prisma.Decimal;
        };
    } & {
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: Prisma.Decimal;
        expenseTypeId: number;
        date: Date;
    }>;
    findAll(query: ExpenseQueryDto): Promise<{
        data: ({
            expenseType: {
                id: number;
                name: string;
                type: import("@prisma/client").$Enums.ExpenseCategoryType;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            account: {
                id: number;
                name: string;
                type: import("@prisma/client").$Enums.AccountType;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                initialBalance: Prisma.Decimal;
            };
        } & {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            accountId: number;
            amount: Prisma.Decimal;
            expenseTypeId: number;
            date: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        expenseType: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.ExpenseCategoryType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        account: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: Prisma.Decimal;
        };
    } & {
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: Prisma.Decimal;
        expenseTypeId: number;
        date: Date;
    }>;
    update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<{
        expenseType: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.ExpenseCategoryType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        account: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: Prisma.Decimal;
        };
    } & {
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: Prisma.Decimal;
        expenseTypeId: number;
        date: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: Prisma.Decimal;
        expenseTypeId: number;
        date: Date;
    }>;
}
