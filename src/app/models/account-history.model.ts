import { Account } from './account.model';

export class AccountHistory {
    id: number;
    typeTransaction: string;
    value: number;
    numberTransaction: number;
    description?: string;
    accountNumberSend?: string;
    dateTransaction?: Date;
    accountTransaction?: Account;
}