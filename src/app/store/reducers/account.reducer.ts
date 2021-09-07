import { createReducer, on } from '@ngrx/store';
import { setAccount, clearAccount } from '../actions';

export interface AccountState {
    account: any
}

export const accountInitialState: AccountState = {
    account: null
}

const _accountReducer = createReducer(accountInitialState,

    on(setAccount, (state, { account }) => ({
        ...state,
        account: account
    })),
    on(clearAccount, state => ({ ...state, account: {} })),

);

export function accountReducer(state, action) {
    return _accountReducer(state, action);
}