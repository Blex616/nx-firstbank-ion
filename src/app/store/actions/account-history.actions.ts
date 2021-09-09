import { createAction, props } from '@ngrx/store';
import { AccountHistory } from '../../models/account-history.model';

export const loadAccountHistory = createAction('[Account History Action] Load Account History', props<{ account: number }>());
export const setAccountHistory = createAction('[Account History Action] Send Account History', props<{ accountHistory: AccountHistory[] }>());
export const clearAccountHistory = createAction('[Account History Action] Clear Account History');