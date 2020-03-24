import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingChangesGuard } from '../pendingchanges.guard';
import { EditorComponent } from './editor.component';

/**
 * routes contains all known paths
 */
const routes: Routes = [
  {
    path: 'editor',
    component: EditorComponent,
    canDeactivate: [
      PendingChangesGuard
    ]
  },
  {
    path: 'editor/:id',
    component: EditorComponent,
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
