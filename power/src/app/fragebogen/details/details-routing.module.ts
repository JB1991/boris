import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details.component';
import { AuthGuard } from '@app/shared/auth/auth.guard';

/**
 * routes contains all known paths
 */
const routes: Routes = [
    {
        path: 'details',
        component: DetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailsRoutingModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
