import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Functions } from 'src/utils/functions';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { loadAccount, loadThirdAccountUser, transferAccountTrhid } from '../../store/actions';
import { Subscription } from 'rxjs';
import { EventProxyService } from 'src/utils/event-proxy';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { User } from '../../models/user.model';
import { Account } from '../../models/account.model';
import { ThirdPartyAccount } from '../../models/third-party-account.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {

  Qr: boolean;

  accounts: Account[];
  user: User;

  accountSub: Subscription;
  userSub: Subscription;
  eventSub: Subscription;


  constructor(private store: Store<AppState>, public functions: Functions, public router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
    public eventProxyService: EventProxyService
  ) { }

  ngOnInit() {
    this.accountSub = this.store.select("account").subscribe(({ account }) => {
      this.accounts = account;
    })
    this.userSub = this.store.select("user").subscribe(({ user }) => {
      this.user = user;
      if (user) {
        this.store.dispatch(loadAccount({ user: user.id }))
      }
    })
    this.eventSub = this.eventProxyService.getEventSubject().subscribe((param: any) => {
      if (param?.QR) this.Qr = param.QR;
    });
  }

  ngOnDestroy() {
    this.accountSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.eventSub?.unsubscribe();
  }

  returnHome() {
    this.router.navigate(['home'])
  }

  format(valString) {
    return this.functions.format(valString)
  };

  async goToQr(item) {
    const modal = await this.modalController.create({
      component: TransactionModal,
      componentProps: {
        user: this.user,
        accountSelected: item,
        Qr: this.Qr
      }
    });
    return await modal.present();
  }

  async presentAlertPrompt(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Saldo a transferir',
      inputs: [
        {
          name: 'valueToTransfer',
          type: 'number',
          placeholder: 'Escriba un número'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Breve descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {

          }
        }, {
          text: 'Continuar',
          handler: (data) => {
            if (data.valueToTransfer > item.balance) {
              this.presentToast("Saldo insuficiente.")
            } else {
              this.presentModal(item, data.valueToTransfer, data.description);
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async presentModal(item, valueToTransfer, description) {
    const modal = await this.modalController.create({
      component: TransactionModal,
      componentProps: {
        user: this.user,
        accountSelected: item,
        valueToTransfer: valueToTransfer,
        description: description
      }
    });
    return await modal.present();
  }

}

@Component({
  selector: 'transaction-modal',
  templateUrl: 'transaction-modal.html',
  styleUrls: ['./transaction.page.scss']

})
export class TransactionModal {

  @Input() user: User;
  @Input() accountSelected: Account;
  @Input() valueToTransfer: number;
  @Input() description: String;
  @Input() Qr: boolean;

  thirdAccounts: ThirdPartyAccount[];
  thirdAccountUserSub: Subscription;

  QrValue: number;
  QrCoin: String;
  QrDescription: String;
  encodedData: object;

  constructor(
    private scanner: BarcodeScanner,
    public modalController: ModalController,
    private store: Store<AppState>,
    public functions: Functions,
    public alertController: AlertController,
    public router: Router) {

  }

  ngOnInit() {
    if (this.user?.id) {
      this.store.dispatch(loadThirdAccountUser({ user: this.user.id }));
    }
    this.thirdAccountUserSub = this.store.select("thirdAccountUser").subscribe(({ thirdAccountUser }) => {
      this.thirdAccounts = thirdAccountUser;
    })
  }

  ngOnDestroy() {
    this.thirdAccountUserSub?.unsubscribe();
  }

  generateBarCode() {
    this.encodedData = {
      QrValue: this.QrValue,
      QrCoin: this.QrCoin,
      QrDescription: this.QrDescription,
      accountSelected: this.accountSelected
    };
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodedData).then(
      res => {
        this.encodedData = res;
      }, error => {
        alert(error);
      }
    );
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  format(valString) {
    return this.functions.format(valString)
  };

  async presentAlertConfirm(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirma tu transacción',
      message: `
      <div>
        <h6><b>Datos de origen</b></h6>
        <p>Número de cuenta: ${this.accountSelected.AcNumber}</p>
        <p>Tipo de cuenta: ${this.accountSelected.type}</p>
        <p>Saldo disponible: ${this.accountSelected.balance}</p>      
      </div>
      <div>
        <h6><b>Datos de envio</b></h6>
        <p>Número de cuenta: ${item.accountNumber}</p>
        <p>Alias: ${item.alias}</p>
        <p>Identificación: ${item.holderIdentification}</p>
        <p>Tipo de cuenta: ${item.accountType}</p>
        <p>Entidad Bancaria: ${item.entityBank}</p>
        <p>Moneda: ${item.coin}</p>
        <p>Descripción: ${this.description}</p>
      </div>
      <div>
        <h6><b>Saldo a enviar</b></h6>
        <p>${this.functions.format(this.valueToTransfer)}</p>
      </div>
      `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.store.dispatch(transferAccountTrhid({
              valueToTransfer: this.valueToTransfer,
              acOrigin: this.accountSelected.AcNumber,
              acSend: item.accountNumber,
              description: this.description
            }))
          }
        }
      ]
    });

    await alert.present();
  }
}

