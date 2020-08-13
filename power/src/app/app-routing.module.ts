import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticModule } from '@app/static/static.module';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => StaticModule
    },
    {
        path: 'immobilienpreisindex',
        loadChildren: () => import('./immobilien/immobilien.module')
        .then(m => m.ImmobilienModule)
    },
    {
        path: 'bodenrichtwerte',
        loadChildren: () => import('./bodenrichtwert/bodenrichtwert.module')
        .then(m => m.BodenrichtwertModule)
    },
    {
        path: 'bodenwertkalkulator',
        loadChildren: () => import('./bodenwert-kalkulator/bodenwert-kalkulator.module')
        .then(m => m.BodenwertKalkulatorModule)
    },
    {
        path: 'forms',
        loadChildren: () => import('./fragebogen/fragebogen.module')
        .then(m => m.FragebogenModule)
    },
    {
        path: '**',
        redirectTo: '', pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
