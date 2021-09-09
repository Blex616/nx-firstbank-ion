import { AccountHistory } from './account-history.model';
import { User } from './user.model';

export class Account {
    id: number;
    AcNumber: string;
    type: string;
    balance: number;
    user?: User;
}