import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabProfilePage } from './tab-profile.page';

import { TabProfilePageRoutingModule } from './tab-profile-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TabProfilePage }]),
    TabProfilePageRoutingModule,
  ],
  declarations: [TabProfilePage]
})
export class TabProfilePageModule { }
