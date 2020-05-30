import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details.component';

/**
 * routes contains all known paths
 */
const routes: Routes = [
  {
    path: 'details',
    component: DetailsComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsRoutingModule { }
