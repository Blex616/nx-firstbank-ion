import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from "@ngrx/effects";
import { appReducers } from './store/app.reducers';
import { EffectsArray } from './store/effects/index';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

import { CanActivateViaAuthGuard } from '../utils/can-activate-via-auth-guard'
import { FormsModule } from '@angular/forms';
import { ActionTypes } from './store/actions/user.action';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { EventProxyService } from "../utils/event-proxy";

export function logoutClearState(reducer) {
  return function (state, action) {
    if (action.type === ActionTypes.LOGOUT) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(appReducers, { metaReducers: [logoutClearState] }),
    EffectsModule.forRoot(EffectsArray),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, CanActivateViaAuthGuard, BarcodeScanner, EventProxyService],
  bootstrap: [AppComponent],
})
export class AppModule { }
