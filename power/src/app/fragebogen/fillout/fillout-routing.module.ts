import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilloutComponent } from './fillout.component';

/**
 * routes contains all known paths
 */
const routes: Routes = [
  {
    path: 'fillout',
    component: FilloutComponent
  },
  {
    path: 'fillout/:id',
    component: FilloutComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilloutRoutingModule { }
