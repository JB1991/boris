import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilloutComponent } from './fillout.component';

import { PendingChangesGuard } from '../pendingchanges.guard';

/**
 * routes contains all known paths
 */
const routes: Routes = [
  {
    path: 'fillout',
    component: FilloutComponent
  },
  {
    path: 'fillout/:pin',
    component: FilloutComponent,
    canDeactivate: [
      PendingChangesGuard
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilloutRoutingModule { }
