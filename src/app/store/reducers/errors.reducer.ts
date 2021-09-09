import { createReducer, on } from '@ngrx/store';
import { ErrorModel } from 'src/app/models/error.model';
import { setError, clearError } from '../actions';

export interface ErrorState {
    error: ErrorModel
}

export const errorInitialState: ErrorState = {
    error: null
}

const _errorReducer = createReducer(errorInitialState,

    on(setError, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            name: payload.name,
            message: payload.error.message_error
        }
    })),
    on(clearError, state => ({ ...state, error: new ErrorModel })),

);

export function errorReducer(state, action) {
    return _errorReducer(state, action);
}