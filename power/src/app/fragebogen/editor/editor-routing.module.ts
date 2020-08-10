import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/auth/auth.guard';

import { EditorComponent } from './editor.component';
import { PendingChangesGuard } from '@app/fragebogen/pendingchanges.guard';

/**
 * routes contains all known paths
 */
const routes: Routes = [
  {
    path: 'editor',
    component: EditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [
      PendingChangesGuard
    ]
  },
  {
    path: 'editor/:id',
    component: EditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [
      PendingChangesGuard
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
