import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabModal, TabProductsPage } from './tab-products.page';

import { TabProductsPagePageRoutingModule } from './tab-products-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabProductsPagePageRoutingModule
  ],
  declarations: [TabProductsPage, TabModal]
})
export class TabProductsPageModule { }
