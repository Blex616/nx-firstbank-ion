import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabHomePage, TabHomePageModal } from './tab-home.page';

import { TabHomePagePageRoutingModule } from './tab-home-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabHomePagePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TabHomePage, TabHomePageModal]
})
export class TabHomePageModule { }
