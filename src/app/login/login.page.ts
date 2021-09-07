import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { loginUser, setError } from '../store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  txtUser = '';
  txtPassword = '';

  constructor(private store: Store<AppState>) { }

  ngOnInit() { }

  loginClient() {
    let paramsRequest = {
      "username": this.txtUser,
      "password": this.txtPassword
    }
    if (this.txtUser && this.txtPassword) {
      this.store.dispatch(loginUser(paramsRequest))
      this.txtUser = "";
      this.txtPassword = "";
    } else {
      this.store.dispatch(setError({
        payload: {
          error: {
            message_error: "Debe ingresar usuario y contraseña"
          }
        }
      }))
    }
  }

}
