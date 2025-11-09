import { IncomeFrequency } from '@prisma/client';
import { CreateIncomeDto } from './create-income.dto';
declare const UpdateIncomeDto_base: import("@nestjs/common").Type<Partial<CreateIncomeDto>>;
export declare class UpdateIncomeDto extends UpdateIncomeDto_base {
    amount?: number;
    accountId?: number;
    frequency?: IncomeFrequency;
    description?: string;
    date?: string;
}
export {};
