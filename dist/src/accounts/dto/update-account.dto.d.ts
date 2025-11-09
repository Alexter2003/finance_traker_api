import { AccountType } from '@prisma/client';
export declare class UpdateAccountDto {
    name?: string;
    type?: AccountType;
    initialBalance?: number;
}
