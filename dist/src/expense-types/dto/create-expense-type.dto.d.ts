import { ExpenseCategoryType } from '@prisma/client';
export declare class CreateExpenseTypeDto {
    name: string;
    type: ExpenseCategoryType;
    description?: string;
}
