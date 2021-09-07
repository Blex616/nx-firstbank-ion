import { createAction, props } from '@ngrx/store';

export const loadThirdAccountUser = createAction('[Third Account User Action] Load Third Account User', props<{ user: any }>());
export const saveThirdAccountUser = createAction('[Third Account User Action] Save Third Account User', props<{ thirdAccount: any }>());
export const setThirdAccountUser = createAction('[Third Account User Action] Send Third Account User', props<{ thirdAccount: any }>());
export const clearThirdAccountUser = createAction('[Third Account User Action] Clear Third Account User');