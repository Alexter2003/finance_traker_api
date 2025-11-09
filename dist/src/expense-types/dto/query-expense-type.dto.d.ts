import { ExpenseCategoryType } from '@prisma/client';
export declare class QueryExpenseTypeDto {
    type?: ExpenseCategoryType;
    search?: string;
    page?: number;
    limit?: number;
}
