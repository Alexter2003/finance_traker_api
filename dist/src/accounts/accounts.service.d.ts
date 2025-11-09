import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { Prisma } from '@prisma/client';
export declare class AccountsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculateBalance(accountId: number): Promise<number>;
    create(createAccountDto: CreateAccountDto): Promise<{
        balance: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: Prisma.Decimal;
    }>;
    findAll(queryDto: QueryAccountDto): Promise<{
        data: {
            balance: number;
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            initialBalance: Prisma.Decimal;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        balance: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: Prisma.Decimal;
    }>;
    update(id: number, updateAccountDto: UpdateAccountDto): Promise<{
        balance: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: Prisma.Decimal;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: Prisma.Decimal;
    }>;
}
