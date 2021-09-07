import { createAction, props } from '@ngrx/store';

export const loadAccount = createAction('[Account Action] Load Account', props<{ user: number }>());
export const setAccount = createAction('[Account Action] Send Account', props<{ account: any }>());
export const clearAccount = createAction('[Account Action] Clear Account');
export const transferAccountTrhid = createAction('[Account Action] Transfer Account', props<{ valueToTransfer: any, acOrigin: any, acSend: any; description: any }>());