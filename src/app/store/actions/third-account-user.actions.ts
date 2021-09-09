import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';
import { ThirdPartyAccount } from '../../models/third-party-account.model';

export const loadThirdAccountUser = createAction('[Third Account User Action] Load Third Account User', props<{ user: number }>());
export const saveThirdAccountUser = createAction('[Third Account User Action] Save Third Account User', props<{ thirdAccount: ThirdPartyAccount }>());
export const setThirdAccountUser = createAction('[Third Account User Action] Send Third Account User', props<{ thirdAccount: ThirdPartyAccount[] }>());
export const clearThirdAccountUser = createAction('[Third Account User Action] Clear Third Account User');