import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto): Promise<{
        fromAccount: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: import("@prisma/client/runtime/library").Decimal;
        };
        toAccount: {
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
        amount: import("@prisma/client/runtime/library").Decimal;
        toAccountId: number;
        fromAccountId: number;
        date: Date;
    }>;
    findAll(queryDto: TransactionQueryDto): Promise<{
        data: ({
            fromAccount: {
                id: number;
                name: string;
                type: import("@prisma/client").$Enums.AccountType;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                initialBalance: import("@prisma/client/runtime/library").Decimal;
            };
            toAccount: {
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
            amount: import("@prisma/client/runtime/library").Decimal;
            toAccountId: number;
            fromAccountId: number;
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
        fromAccount: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: import("@prisma/client/runtime/library").Decimal;
        };
        toAccount: {
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
        amount: import("@prisma/client/runtime/library").Decimal;
        toAccountId: number;
        fromAccountId: number;
        date: Date;
    }>;
    update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
        fromAccount: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: import("@prisma/client/runtime/library").Decimal;
        };
        toAccount: {
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
        amount: import("@prisma/client/runtime/library").Decimal;
        toAccountId: number;
        fromAccountId: number;
        date: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        toAccountId: number;
        fromAccountId: number;
        date: Date;
    }>;
}
