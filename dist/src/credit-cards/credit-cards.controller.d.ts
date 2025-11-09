import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { QueryCreditCardDto } from './dto/query-credit-card.dto';
export declare class CreditCardsController {
    private readonly creditCardsService;
    constructor(creditCardsService: CreditCardsService);
    create(createCreditCardDto: CreateCreditCardDto): Promise<{
        balance: number;
        debt: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: import("@prisma/client/runtime/library").Decimal;
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
            initialBalance: import("@prisma/client/runtime/library").Decimal;
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
        initialBalance: import("@prisma/client/runtime/library").Decimal;
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
        initialBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
}
