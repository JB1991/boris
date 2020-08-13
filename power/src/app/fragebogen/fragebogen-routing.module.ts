import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

/**
 * routes contains all known paths
 */
const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FragebogenRoutingModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
