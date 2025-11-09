import { AccountType } from '@prisma/client';
export declare class QueryAccountDto {
    type?: AccountType;
    search?: string;
    page?: number;
    limit?: number;
}
