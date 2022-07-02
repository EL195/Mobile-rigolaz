import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifycomptePage } from './modifycompte.page';

const routes: Routes = [
  {
    path: '',
    component: ModifycomptePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifycomptePageRoutingModule {}
