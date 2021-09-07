import { createReducer, on } from '@ngrx/store';
import { loadUserSuccess } from '../actions';
import { User } from '../../models/user.model';

export interface UserState {
    user: User,
}

export const userInitialState: UserState = {
    user: null,
}

const _userReducer = createReducer(userInitialState,

    on(loadUserSuccess, (state, { user }) => ({
        ...state,
        user: { ...user }
    }))
);

export function userReducer(state, action) {
    return _userReducer(state, action);
}