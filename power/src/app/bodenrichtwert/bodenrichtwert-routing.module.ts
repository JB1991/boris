import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodenrichtwertComponent } from './bodenrichtwert-component/bodenrichtwert.component';

const routes: Routes = [
    {
        path: '',
        component: BodenrichtwertComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BodenrichtwertRoutingModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
