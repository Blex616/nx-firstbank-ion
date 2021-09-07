import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { stopLoading, clearError } from './store/actions';
import { Functions } from '../utils/functions'
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { loadUser } from './store/actions/user.action';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  load;
  loadingInProcess = null;
  uiSub: Subscription;
  errorSub: Subscription;
  userInfo: any = {};
  authorization = '';

  constructor(private store: Store<AppState>,
    public loadingController: LoadingController, public alertController: AlertController,
    private functions: Functions,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.uiSub = this.store.select('ui').subscribe(({ isLoading }) => {
      this.loading(isLoading);
    })
    this.errorSub = this.store.select('error').subscribe(({ error }) => {
      if (error?.message) this.presentAlert(error?.message);
    })
    this.authorization = this.functions.authorization();
    this.userInfo = this.authorization ? this.functions.decodedJwt(this.authorization) : {}
    if (this.userInfo?.username) {
      this.store.dispatch(loadUser({ username: this.userInfo.username }))
    }
    this.validateLogin();
  }

  ngOnDestroy() {
    this.uiSub?.unsubscribe();
    this.errorSub?.unsubscribe();
  }

  async loading(isLoading) {
    let topLoader = await this.loadingController.getTop();
    if (isLoading && !topLoader) {
      this.load = await this.loadingController.create({
        message: 'Por favor espere...',
      });
      this.loadingInProcess = await this.load.present();
    } else {
      await this.stopLoading();
    }
  }

  async stopLoading() {
    setTimeout(() => {
      this.load?.dismiss();
    }, 500);
  }

  async presentAlert(message) {
    this.store.dispatch(stopLoading())
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Hay un problema',
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
    await alert.onDidDismiss().then(() => {
      this.store.dispatch(clearError())
    });
  }

  validateLogin() {
    if (this.functions.authorization()) {
      this.navCtrl.navigateRoot('home');
    }
  }

}
