import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from '../../models/user.model';
import { Logout } from '../../store/actions/user.action';

@Component({
  selector: 'app-tab-profile',
  templateUrl: 'tab-profile.page.html',
  styleUrls: ['tab-profile.page.scss']
})
export class TabProfilePage {

  userSub: Subscription;
  user: User;

  constructor(public store: Store<AppState>, private router: Router, public toastController: ToastController) { }

  ngOnInit() {
    this.userSub = this.store.select("user").subscribe(({ user }) => {
      this.user = user;
    })
  }

  async logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.store.dispatch(new Logout());
    const toast = await this.toastController.create({
      message: 'Hasta luego',
      duration: 2000
    });
    toast.present();
  }

}
