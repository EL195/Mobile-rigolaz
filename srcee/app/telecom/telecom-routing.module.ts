import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TelecomPage } from './telecom.page';

const routes: Routes = [
  {
    path: '',
    component: TelecomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TelecomPageRoutingModule {}
