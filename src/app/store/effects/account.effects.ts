import { Injectable } from "@angular/core";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { mergeMap, tap, map, catchError, switchMap } from 'rxjs/operators';
import { loadAccount, isLoading, stopLoading, setAccount, setError, transferAccountTrhid } from "../actions";
import { AccountService } from '../../services/account.service';
import { of } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from 'src/app/store/app.reducers';
import { loadAccountHistory } from '../actions/account-history.actions';
import { AlertController, ModalController } from '@ionic/angular';

@Injectable()
export class AccountEffects {

    constructor(public modalController: ModalController, private actions$: Actions, private accountService: AccountService, private router: Router, private store$: Store<AppState>, public alertController: AlertController) { }

    accountUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(loadAccount),
            tap(() => this.store$.dispatch(isLoading())),
            mergeMap(
                (action) => this.accountService.getAccountsUser(action)
                    .pipe(
                        tap(data => {
                            this.store$.dispatch(stopLoading())
                        }),
                        map(account => setAccount({ account: account })),
                        catchError(err => {
                            this.store$.dispatch(stopLoading())
                            return of(setError({ payload: err }))
                        })
                    )
            )
        )
    );

    transferAccountUserThird$ = createEffect(
        () => this.actions$.pipe(
            ofType(transferAccountTrhid),
            tap(() => this.store$.dispatch(isLoading())),
            switchMap((action) => this.accountService.transferAccountThird(action)
                .pipe(
                    tap(data => {
                        this.store$.dispatch(stopLoading())
                    })
                )
            ),
            switchMap((res: any) => {
                this.presentAlert(res.numberTransaction)
                this.modalController.dismiss({
                    'dismissed': true
                });
                this.router.navigate(['home'])
                return [

                    loadAccount({ user: res.user }),
                    loadAccountHistory({ account: res.account })
                ]
            }),
            catchError(err => {
                this.store$.dispatch(stopLoading())
                return of(setError({ payload: err }))
            })
        )
    );

    async presentAlert(numberComprobant) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Exito',
            subHeader: 'Transacción exitosa',
            message: `Su Transacción ha sido exitosa, el número de comprobante es ${numberComprobant}`,
            buttons: ['Confirmar']
        });
        await alert.present();
        await alert.onDidDismiss();
    }
}