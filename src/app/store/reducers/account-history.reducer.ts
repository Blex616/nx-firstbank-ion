import { createReducer, on } from '@ngrx/store';
import { loadAccountHistory, setAccountHistory, clearAccountHistory } from '../actions';

export interface AccountHistoryState {
    accountHistory: any
}

export const accountHistoryInitialState: AccountHistoryState = {
    accountHistory: null
}

const _accountHistoryReducer = createReducer(accountHistoryInitialState,

    on(loadAccountHistory, (state, { account }) => ({
        ...state,
        account: account
    })),
    on(setAccountHistory, (state, { account }) => ({ ...state, accountHistory: account })),
    on(clearAccountHistory, state => ({ ...state, account: {} })),

);

export function accountHistoryReducer(state, action) {
    return _accountHistoryReducer(state, action);
}