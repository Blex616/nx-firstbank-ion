import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { AlertController, AlertInput, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveThirdAccountUser } from '../../store/actions/third-account-user.actions';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { EventProxyService } from '../../../utils/event-proxy';
import { transferAccountTrhid } from '../../store/actions';
import { loadAccount } from '../../store/actions/account.actions';
import { User } from '../../models/user.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-tab-home',
  templateUrl: 'tab-home.page.html',
  styleUrls: ['tab-home.page.scss']
})
export class TabHomePage {

  userSub: Subscription;
  accountSub: Subscription;

  scannedBarCode: any;

  user: User;
  account: Account[];

  valueToTransfer: number;
  accountSelected: number;
  description: String;

  constructor(
    private scanner: BarcodeScanner,
    private store: Store<AppState>,
    public modalController: ModalController,
    private router: Router,
    public actionSheetController: ActionSheetController,
    public eventProxyService: EventProxyService,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.userSub = this.store.select('user').subscribe(({ user }) => {
      this.user = user;
      if (this.user?.id) this.store.dispatch(loadAccount({ user: this.user.id }))
    })
    this.accountSub = this.store.select("account").subscribe(({ account }) => {
      this.account = account;
    })
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  scanBRcode() {
    this.scanner.scan().then(res => {
      this.scannedBarCode = res;
      this.presentModal(JSON.parse(this.scannedBarCode.text))
    }).catch(err => {
      alert(err);
    });
  }

  transferQR() {
    this.eventProxyService.triggerSomeEvent({ QR: true });
    this.router.navigate(['transaction'])
  }

  async presentModal(dataQr) {
    const modal = await this.modalController.create({
      component: TabHomePageModal,
      componentProps: {
        dataQr: dataQr
      }
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
          this.eventProxyService.triggerSomeEvent({ QR: false });
          this.router.navigate(['transaction'])
        }
      }, {
        text: 'Con código QR',
        icon: 'qr-code-outline',
        handler: () => {
          this.scanBRcode();
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

  @Input() dataQr: any;

  thirdPartyUserForm: FormGroup;
  transferForQR: FormGroup;

  userSub: Subscription;
  accountSub: Subscription;

  user: User;
  accounts: Account[];

  valueToTransfer: number;
  accountSelected: number;
  description: String;

  constructor(private scanner: BarcodeScanner, public modalController: ModalController, private store: Store<AppState>, private fb: FormBuilder, public toastController: ToastController) { }

  ngOnInit() {
    this.thirdPartyUserForm = this.fb.group({
      alias: ['', Validators.required],
      entityBank: ['', Validators.required],
      accountType: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      holderIdentification: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      coin: ['', Validators.required]
    })
    this.transferForQR = this.fb.group({
      valueToTransfer: [this.dataQr?.QrValue, [Validators.required, Validators.pattern('[0-9]*')]],
      accountSelected: ['', Validators.required],
      description: [this.dataQr?.QrDescription, Validators.required]
    })
    this.userSub = this.store.select("user").subscribe(({ user }) => {
      this.user = user;
    })
    this.accountSub = this.store.select("account").subscribe(({ account }) => {
      this.accounts = account;
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

  sendTransactionQr() {
    if (this.transferForQR.invalid) return;
    let accountC = this.accounts.filter(
      data => data.AcNumber === this.transferForQR.value.accountSelected
    )
    if (accountC.length) {
      if (this.transferForQR.value.valueToTransfer > accountC[0].balance) {
        this.presentToast("Saldo insuficiente en la cuenta seleccionada")
        return;
      }
    }
    this.store.dispatch(transferAccountTrhid({
      valueToTransfer: this.transferForQR.value.valueToTransfer,
      acOrigin: this.transferForQR.value.accountSelected,
      acSend: this.dataQr.accountSelected.AcNumber,
      description: this.transferForQR.value.description
    }))
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
