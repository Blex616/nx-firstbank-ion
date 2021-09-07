import { createReducer, on } from '@ngrx/store';
import { loadThirdAccountUser, saveThirdAccountUser, setThirdAccountUser, clearThirdAccountUser } from '../actions';

export interface ThirdAccountUserState {
    thirdAccountUser: any
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