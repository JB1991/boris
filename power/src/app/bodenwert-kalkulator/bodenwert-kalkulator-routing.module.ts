import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodenwertKalkulatorComponent } from './bodenwert-kalkulator/bodenwert-kalkulator.component';

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
/* vim: set expandtab ts=4 sw=4 sts=4: */
