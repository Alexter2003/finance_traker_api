import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { QueryExpenseTypeDto } from './dto/query-expense-type.dto';
export declare class ExpenseTypesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createExpenseTypeDto: CreateExpenseTypeDto): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.ExpenseCategoryType;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(queryDto: QueryExpenseTypeDto): Promise<{
        data: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.ExpenseCategoryType;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.ExpenseCategoryType;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: number, updateExpenseTypeDto: UpdateExpenseTypeDto): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.ExpenseCategoryType;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.ExpenseCategoryType;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
