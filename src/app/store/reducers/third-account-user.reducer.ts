import { createReducer, on } from '@ngrx/store';
import { loadThirdAccountUser, saveThirdAccountUser, setThirdAccountUser, clearThirdAccountUser } from '../actions';
import { ThirdPartyAccount } from '../../models/third-party-account.model';

export interface ThirdAccountUserState {
    thirdAccountUser: ThirdPartyAccount[]
}

export const thirdAccountUserInitialState: ThirdAccountUserState = {
    thirdAccountUser: null
}

const _thirdAccountUserReducer = createReducer(thirdAccountUserInitialState,

    on(loadThirdAccountUser, (state, { user }) => ({
        ...state,
        user: user
    })),
    on(saveThirdAccountUser, (state, { thirdAccount }) => ({ ...state, thirdAccount: thirdAccount })),
    on(setThirdAccountUser, (state, { thirdAccount }) => ({ ...state, thirdAccountUser: thirdAccount })),
    on(clearThirdAccountUser, state => ({ ...state, thirdAccount: [] })),

);

export function thirdAccountUserReducer(state, action) {
    return _thirdAccountUserReducer(state, action);
}