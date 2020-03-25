import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingChangesGuard } from '../pendingchanges.guard';
import { AccessGuard } from './access.guard';
import { FormularComponent } from './formular.component';
import { EditFormularComponent } from './edit-formular/edit-formular.component';

/**
 * routes contains all known paths
 */
const routes: Routes = [
  {
    path: 'formular',
    component: FormularComponent
  },
  {
    path: 'formular/:id',
    component: EditFormularComponent,
    canActivate: [
      AccessGuard
    ],
    canDeactivate: [
      PendingChangesGuard
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularRoutingModule { }
