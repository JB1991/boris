import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BodenwertKalkulatorComponent} from '@app/bodenwert-kalkulator/bodenwert-kalkulator/bodenwert-kalkulator.component';

const routes: Routes = [
  {
    path: '',
    component: BodenwertKalkulatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodenwertKalkulatorRoutingModule {
}
