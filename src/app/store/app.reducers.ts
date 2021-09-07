import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';


export interface AppState {
   user: reducers.UserState
   ui: reducers.UiState,
   error: reducers.ErrorState,
   account: reducers.AccountState,
   accountHistory: reducers.AccountHistoryState,
   thirdAccountUser: reducers.ThirdAccountUserState

}

export const appReducers: ActionReducerMap<AppState> = {
   user: reducers.userReducer,
   ui: reducers.uiReducer,
   error: reducers.errorReducer,
   account: reducers.accountReducer,
   accountHistory: reducers.accountHistoryReducer,
   thirdAccountUser: reducers.thirdAccountUserReducer
}