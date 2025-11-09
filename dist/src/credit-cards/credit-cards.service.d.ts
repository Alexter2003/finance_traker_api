import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { QueryCreditCardDto } from './dto/query-credit-card.dto';
import { Prisma } from '@prisma/client';
export declare class CreditCardsService {
    private readonly prisma;
    private readonly accountsService;
    constructor(prisma: PrismaService, accountsService: AccountsService);
    calculateBalance(creditCardId: number): Promise<number>;
    getDebt(creditCardId: number): Promise<number>;
    create(createCreditCardDto: CreateCreditCardDto): Promise<{
        balance: number;
        debt: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: Prisma.Decimal;
    }>;
    findAll(queryDto: QueryCreditCardDto): Promise<{
        data: {
            balance: number;
            debt: number;
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
        debt: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: Prisma.Decimal;
    }>;
    update(id: number, updateCreditCardDto: UpdateCreditCardDto): Promise<{
        balance: number;
        debt: number;
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
