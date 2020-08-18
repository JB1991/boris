import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicDashboardComponent } from './public-dashboard.component';

/**
 * routes contains all known paths
 */
const routes: Routes = [
  {
      path: 'public-dashboard',
      component: PublicDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicDashboardRoutingModule { }
