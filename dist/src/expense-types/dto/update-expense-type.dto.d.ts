import { ExpenseCategoryType } from '@prisma/client';
export declare class UpdateExpenseTypeDto {
    name?: string;
    type?: ExpenseCategoryType;
    description?: string;
}
