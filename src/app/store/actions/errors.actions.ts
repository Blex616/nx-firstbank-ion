import { createAction, props } from '@ngrx/store';

export const setError = createAction('[Error Action] Send Error', props<{ payload: any }>());
export const clearError = createAction('[Error Action] Clear Error');