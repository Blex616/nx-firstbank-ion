import { createReducer, on } from '@ngrx/store';
import { loadAccountHistory, setAccountHistory, clearAccountHistory } from '../actions';
import { AccountHistory } from '../../models/account-history.model';

export interface AccountHistoryState {
    accountHistory: AccountHistory[]
}

export const accountHistoryInitialState: AccountHistoryState = {
    accountHistory: null
}

const _accountHistoryReducer = createReducer(accountHistoryInitialState,

    on(loadAccountHistory, (state, { account }) => ({
        ...state,
        account: account
    })),
    on(setAccountHistory, (state, { accountHistory }) => ({ ...state, accountHistory: accountHistory })),
    on(clearAccountHistory, state => ({ ...state, accountHistory: [] })),

);

export function accountHistoryReducer(state, action) {
    return _accountHistoryReducer(state, action);
}