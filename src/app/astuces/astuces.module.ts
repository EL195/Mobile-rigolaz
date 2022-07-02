import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AstucesPageRoutingModule } from './astuces-routing.module';

import { AstucesPage } from './astuces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AstucesPageRoutingModule
  ],
  declarations: [AstucesPage]
})
export class AstucesPageModule {}
