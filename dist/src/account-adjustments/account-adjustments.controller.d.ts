import { AccountAdjustmentsService } from './account-adjustments.service';
import { CreateAccountAdjustmentDto } from './dto/create-account-adjustment.dto';
import { UpdateAccountAdjustmentDto } from './dto/update-account-adjustment.dto';
import { QueryAccountAdjustmentDto } from './dto/query-account-adjustment.dto';
export declare class AccountAdjustmentsController {
    private readonly accountAdjustmentsService;
    constructor(accountAdjustmentsService: AccountAdjustmentsService);
    create(createAccountAdjustmentDto: CreateAccountAdjustmentDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        reason: string;
    }>;
    findAll(query: QueryAccountAdjustmentDto): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            accountId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            date: Date;
            reason: string;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        reason: string;
    }>;
    update(id: number, updateAccountAdjustmentDto: UpdateAccountAdjustmentDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        reason: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        accountId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        reason: string;
    }>;
}
