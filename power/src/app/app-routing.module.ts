import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticModule } from '@app/static/static.module';

import { ModuleGuard } from './module.guard';

/* istanbul ignore next */
const routes: Routes = [
    {
        path: '',
        loadChildren: () => StaticModule
    },
    {
        path: 'immobilienpreisindex',
        loadChildren: () => import('./immobilien/immobilien.module')
            .then(m => m.ImmobilienModule),
        canActivate: [ModuleGuard]
    },
    {
        path: 'bodenrichtwerte',
        loadChildren: () => import('./bodenrichtwert/bodenrichtwert.module')
            .then(m => m.BodenrichtwertModule),
        canActivate: [ModuleGuard]
    },
    {
        path: 'bodenwertkalkulator',
        loadChildren: () => import('./bodenwert-kalkulator/bodenwert-kalkulator.module')
            .then(m => m.BodenwertKalkulatorModule),
        canActivate: [ModuleGuard]
    },
    {
        path: 'forms',
        loadChildren: () => import('./fragebogen/fragebogen.module')
            .then(m => m.FragebogenModule),
        canActivate: [ModuleGuard]
    },
    {
        path: 'grundstuecksmarktberichte',
        loadChildren: () => import('./gmb/gmb.module')
            .then(m => m.GmbModule),
        canActivate: [ModuleGuard],
        data: {'mode': 'gmb'}
    },
    {
        path: 'landesgrundstuecksmarktberichte',
        loadChildren: () => import('./gmb/gmb.module')
            .then(m => m.GmbModule),
        canActivate: [ModuleGuard],
        data: {'mode': 'lmb'}
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
