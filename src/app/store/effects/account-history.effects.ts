import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, tap, map, catchError } from 'rxjs/operators';
import { loadAccountHistory, isLoading, stopLoading, setAccountHistory, setError } from "../actions";
import { AccountService } from '../../services/account.service';
import { of } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from 'src/app/store/app.reducers';

@Injectable()
export class AccountHistoryEffects {

    constructor(private actions$: Actions, private accountService: AccountService, private router: Router, private store$: Store<AppState>) { }

    accountUserHistory$ = createEffect(
        () => this.actions$.pipe(
            ofType(loadAccountHistory),
            tap(() => this.store$.dispatch(isLoading())),
            mergeMap(
                (action) => this.accountService.getAccountsUserHistory(action)
                    .pipe(
                        tap(data => {
                            this.store$.dispatch(stopLoading())
                        }),
                        map(accountHistory => setAccountHistory({ accountHistory: accountHistory })),
                        catchError(err => {
                            this.store$.dispatch(stopLoading())
                            return of(setError({ payload: err }))
                        })
                    )
            )
        )
    );

}