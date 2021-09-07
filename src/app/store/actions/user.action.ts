import { Action, createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const loadUser = createAction('[User] Load User', props<{ username: string }>());
export const loginUser = createAction('[User] Login User', props<{ username: string, password: string }>());
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());

export class ActionTypes {
    static LOGOUT = "[App] logout";
}

export class Logout implements Action {
    readonly type = ActionTypes.LOGOUT;
}