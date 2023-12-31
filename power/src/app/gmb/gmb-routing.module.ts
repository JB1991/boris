import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmbComponent } from './gmb.component';

const routes: Routes = [
    {
        path: '',
        component: GmbComponent,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GmbRoutingModule { }

/* vim: set expandtab ts=4 sw=4 sts=4: */
