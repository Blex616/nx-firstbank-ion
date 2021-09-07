import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, tap, map, catchError } from 'rxjs/operators';
import { saveThirdAccountUser, isLoading, stopLoading, setThirdAccountUser, setError, loadThirdAccountUser } from "../actions";
import { ThirdAccountUserService } from '../../services/third-account.user.service';
import { of } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from 'src/app/store/app.reducers';
import { ModalController, ToastController } from '@ionic/angular';

@Injectable()
export class ThirdAccountUserEffects {

    constructor(private actions$: Actions, public modalController: ModalController, private accountService: ThirdAccountUserService, private router: Router, private store$: Store<AppState>, public toastController: ToastController) { }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }

    thirdAccountUserSave$ = createEffect(
        () => this.actions$.pipe(
            ofType(saveThirdAccountUser),
            tap(() => this.store$.dispatch(isLoading())),
            mergeMap(
                (action) => this.accountService.saveThirdAccountUser(action)
                    .pipe(
                        tap(data => {
                            this.store$.dispatch(stopLoading())
                            this.presentToast("Guardado correctamente")
                            this.modalController.dismiss({
                                'dismissed': true
                            });
                        }),
                        map(account => loadThirdAccountUser({ user: account.user })),
                        catchError(err => {
                            this.store$.dispatch(stopLoading())
                            return of(setError({ payload: err }))
                        })
                    )
            )
        )
    );

    thirdAccountsUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(loadThirdAccountUser),
            tap(() => this.store$.dispatch(isLoading())),
            mergeMap(
                (action) => this.accountService.thirdAccounstUser(action)
                    .pipe(
                        tap(data => {
                            this.store$.dispatch(stopLoading())
                        }),
                        map(account => setThirdAccountUser({ thirdAccount: account })),
                        catchError(err => {
                            this.store$.dispatch(stopLoading())
                            return of(setError({ payload: err }))
                        })
                    )
            )
        )
    );

}