import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    create(createAccountDto: CreateAccountDto): Promise<{
        balance: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: import("@prisma/client/runtime/library").Decimal;
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
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.AccountType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        initialBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: number, updateAccountDto: UpdateAccountDto): Promise<{
        balance: number;
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
