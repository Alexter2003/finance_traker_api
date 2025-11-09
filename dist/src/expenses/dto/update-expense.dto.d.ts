import { CreateExpenseDto } from './create-expense.dto';
declare const UpdateExpenseDto_base: import("@nestjs/common").Type<Partial<CreateExpenseDto>>;
export declare class UpdateExpenseDto extends UpdateExpenseDto_base {
    amount?: number;
    accountId?: number;
    expenseTypeId?: number;
    description?: string;
    date?: string;
}
export {};
