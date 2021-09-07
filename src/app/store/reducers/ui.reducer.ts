import { createReducer, on } from '@ngrx/store';
import { isLoading, stopLoading } from '../actions';

export interface UiState {
    isLoading: boolean;
}

export const uiInitialState: UiState = {
    isLoading: false
}

const _uiReducer = createReducer(uiInitialState,

    on(isLoading, state => ({ ...state, isLoading: true })),
    on(stopLoading, state => ({ ...state, isLoading: false })),

);

export function uiReducer(state, action) {
    return _uiReducer(state, action);
}