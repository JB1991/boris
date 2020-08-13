import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ImmobilienComponent} from './immobilien/immobilien.component';

const routes: Routes = [
    {
        path: '',
        component: ImmobilienComponent,
        children: [
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImmobilienRoutingModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
