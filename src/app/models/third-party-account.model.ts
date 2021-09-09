import { User } from "./user.model";

export class ThirdPartyAccount {
    id: number;
    alias: string;
    entityBank: string;
    accountType: string;
    accountNumber?: string;
    holderIdentification?: string;
    coin?: string;
    user?: User;
}