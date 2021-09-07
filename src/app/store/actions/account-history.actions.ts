import { createAction, props } from '@ngrx/store';

export const loadAccountHistory = createAction('[Account History Action] Load Account History', props<{ account: number }>());
export const setAccountHistory = createAction('[Account History Action] Send Account History', props<{ account: number }>());
export const clearAccountHistory = createAction('[Account History Action] Clear Account History');