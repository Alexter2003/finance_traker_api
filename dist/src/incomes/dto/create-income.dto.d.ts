import { IncomeFrequency } from '@prisma/client';
export declare class CreateIncomeDto {
    amount: number;
    accountId: number;
    frequency: IncomeFrequency;
    description?: string;
    date: string;
}
