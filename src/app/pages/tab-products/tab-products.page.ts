import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { loadAccount, setError } from '../../store/actions';
import { ModalController } from '@ionic/angular';
import { loadAccountHistory } from '../../store/actions/account-history.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Functions } from '../../../utils/functions';
import { Subscription } from 'rxjs';
import { Account } from '../../models/account.model';
import { AccountHistory } from '../../models/account-history.model';

@Component({
  selector: 'app-tab-products',
  templateUrl: 'tab-products.page.html',
  styleUrls: ['tab-products.page.scss']
})
export class TabProductsPage {

  accounts: Account[];

  userSub: Subscription;
  accountSub: Subscription;

  constructor(private store: Store<AppState>, public modalController: ModalController, private route: ActivatedRoute, public functions: Functions) { }

  ngOnInit() {
    this.userSub = this.store.select('user').subscribe(({ user }) => {
      if (user) {
        this.store.dispatch(loadAccount({ user: user.id }))
      }
    })

    this.accountSub = this.store.select("account").subscribe(({ account }) => {
      this.accounts = account;
    })

  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
    this.accountSub?.unsubscribe();
  }

  format(valString) {
    return this.functions.format(valString)
  };

  async presentModal(account) {
    const modal = await this.modalController.create({
      component: TabModal,
      componentProps: {
        accountId: account,
      }
    });
    return await modal.present();
  }

}

@Component({
  selector: 'tab-products-modal',
  templateUrl: 'tab-products-modal.html',
  styleUrls: ['tab-products.page.scss']

})
export class TabModal {

  @Input() accountId: number;

  accountHistorySub: Subscription;

  accountHistory: AccountHistory[];

  constructor(public modalController: ModalController, private store: Store<AppState>, public functions: Functions) {

  }

  ngOnInit() {
    if (this.accountId) {
      this.store.dispatch(loadAccountHistory({ account: this.accountId }));
    }
    this.accountHistorySub = this.store.select("accountHistory").subscribe(({ accountHistory }) => {
      this.accountHistory = accountHistory;
    })
  }

  ngOnDestroy() {
    this.accountHistorySub?.unsubscribe();
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  format(valString) {
    return this.functions.format(valString)
  };
}