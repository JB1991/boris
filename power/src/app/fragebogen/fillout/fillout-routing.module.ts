import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilloutComponent } from './fillout.component';
import { PendingChangesGuard } from '@app/fragebogen/pendingchanges.guard';

/**
 * routes contains all known paths
 */
const routes: Routes = [
    {
        path: 'fillout',
        component: FilloutComponent
    },
    {
        path: 'fillout/:pin',
        component: FilloutComponent,
        canDeactivate: [
            PendingChangesGuard
        ]
    },
    {
        path: 'fillout/form/:id',
        component: FilloutComponent,
        canDeactivate: [
            PendingChangesGuard
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FilloutRoutingModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
