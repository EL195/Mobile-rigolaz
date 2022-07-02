import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AstucesPage } from './astuces.page';

const routes: Routes = [
  {
    path: '',
    component: AstucesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AstucesPageRoutingModule {}
