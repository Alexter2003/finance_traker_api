import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeQueryDto } from './dto/income-query.dto';
export declare class IncomesController {
    private readonly incomesService;
    constructor(incomesService: IncomesService);
    create(createIncomeDto: CreateIncomeDto): Promise<{
        account: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        frequency: import("@prisma/client").$Enums.IncomeFrequency;
    }>;
    findAll(query: IncomeQueryDto): Promise<{
        data: ({
            account: {
                id: number;
                name: string;
                type: import("@prisma/client").$Enums.AccountType;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                initialBalance: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            accountId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            date: Date;
            frequency: import("@prisma/client").$Enums.IncomeFrequency;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        account: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        frequency: import("@prisma/client").$Enums.IncomeFrequency;
    }>;
    update(id: number, updateIncomeDto: UpdateIncomeDto): Promise<{
        account: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        frequency: import("@prisma/client").$Enums.IncomeFrequency;
    }>;
    remove(id: number): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        frequency: import("@prisma/client").$Enums.IncomeFrequency;
    }>;
}
