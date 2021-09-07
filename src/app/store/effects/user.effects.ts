import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, tap, map, catchError } from 'rxjs/operators';
import { loadUser, isLoading, stopLoading, loginUser, loadUserSuccess, setError } from "../actions";
import { UserService } from '../../services/user.service';
import { of } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from 'src/app/store/app.reducers';
import { Functions } from "src/utils/functions";

@Injectable()
export class UsuarioEffects {

    constructor(private actions$: Actions, private userService: UserService, private router: Router, private store$: Store<AppState>, private functions: Functions) { }

    loginUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(loginUser),
            tap(() => this.store$.dispatch(isLoading())),
            mergeMap(
                (action) => this.userService.login(action)
                    .pipe(
                        tap(data => {
                            this.functions.saveToken(data.accessToken)
                            this.router.navigateByUrl('home')
                            this.store$.dispatch(stopLoading())
                        }),
                        map(user => loadUserSuccess({ user: user })),
                        catchError(err => {
                            this.store$.dispatch(stopLoading())
                            return of(setError({ payload: err }))
                        })
                    )
            )
        )
    );

    loadUserEf$ = createEffect(
        () => this.actions$.pipe(
            ofType(loadUser),
            tap(() => this.store$.dispatch(isLoading())),
            mergeMap(
                (action) => this.userService.getUser(action)
                    .pipe(
                        tap(data => {
                            this.store$.dispatch(stopLoading())
                        }),
                        map(user => loadUserSuccess({ user })),
                        catchError(err => {
                            this.store$.dispatch(stopLoading())
                            return of(setError({ payload: err }))
                        })
                    )
            )
        )
    );

}