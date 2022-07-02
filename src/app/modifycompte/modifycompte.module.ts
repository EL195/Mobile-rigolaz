import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifycomptePageRoutingModule } from './modifycompte-routing.module';

import { ModifycomptePage } from './modifycompte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifycomptePageRoutingModule
  ],
  declarations: [ModifycomptePage]
})
export class ModifycomptePageModule {}
