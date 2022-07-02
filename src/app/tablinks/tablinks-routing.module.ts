import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablinksPage } from './tablinks.page';

const routes: Routes = [
  {
    path: 'tablinks',
    component: TablinksPage,
    children: [
      {
        path: 'pay',
        loadChildren: () => import('../pay/pay.module').then(m => m.PayPageModule)
      },
      {
        path: 'telecom',
        loadChildren: () => import('../telecom/telecom.module').then(m => m.TelecomPageModule)
      },
      {
        path: 'codes',
        loadChildren: () => import('../codes/codes.module').then(m => m.CodesPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tablinks/pay',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablinksPageRoutingModule {}
