import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveThirdAccountUser } from '../store/actions/third-account-user.actions';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-home',
  templateUrl: 'tab-home.page.html',
  styleUrls: ['tab-home.page.scss']
})
export class TabHomePage {

  user: any;
  userSub: Subscription;

  constructor(private store: Store<AppState>, public modalController: ModalController, private router: Router, public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.userSub = this.store.select('user').subscribe(({ user }) => {
      this.user = user;
    })
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TabHomePageModal
    });
    return await modal.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Transferir',
      buttons: [{
        text: 'A cuentas inscritas',
        icon: 'send-outline',
        handler: () => {
          this.router.navigate(['transaction'])
        }
      }, {
        text: 'Con código QR',
        icon: 'qr-code-outline',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss();
  }


}

@Component({
  selector: 'app-tab-home-modal',
  templateUrl: 'tab-home-modal.html',
  styleUrls: ['tab-home.page.scss']
})
export class TabHomePageModal {

  thirdPartyUserForm: FormGroup;
  user: any;
  userSub: Subscription;

  constructor(public modalController: ModalController, private store: Store<AppState>, private fb: FormBuilder, public toastController: ToastController) { }

  ngOnInit() {
    this.thirdPartyUserForm = this.fb.group({
      alias: ['', Validators.required],
      entityBank: ['', Validators.required],
      accountType: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      holderIdentification: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      coin: ['', Validators.required]
    })
    this.userSub = this.store.select("user").subscribe(({ user }) => {
      this.user = user;
    })

  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  saveThirdPartyAccount() {
    if (this.thirdPartyUserForm.invalid) return;
    if (this.user) {
      this.store.dispatch(saveThirdAccountUser({ ...this.thirdPartyUserForm.value, user: this.user.id }))
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  validateCharacters($event) {
    let validate = $event.key;
    if (validate.length === 1 && validate.match(/[a-z]/i)) $event.preventDefault()
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
