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
        loadChildren: async () => import('./immobilien/immobilien.module')
            .then((m) => m.ImmobilienModule),
        canActivate: [ModuleGuard]
    },
    {
        path: 'bodenrichtwerte',
        loadChildren: async () => import('./bodenrichtwert/bodenrichtwert.module')
            .then((m) => m.BodenrichtwertModule),
        canActivate: [ModuleGuard]
    },
    {
        path: 'forms',
        loadChildren: async () => import('./fragebogen/fragebogen.module')
            .then((m) => m.FragebogenModule),
        canActivate: [ModuleGuard]
    },
    {
        path: 'grundstuecksmarktberichte',
        loadChildren: async () => import('./gmb/gmb.module')
            .then((m) => m.GmbModule),
        canActivate: [ModuleGuard],
        data: { 'mode': 'gmb' }
    },
    {
        path: 'landesgrundstuecksmarktberichte',
        loadChildren: async () => import('./gmb/gmb.module')
            .then((m) => m.GmbModule),
        canActivate: [ModuleGuard],
        data: { 'mode': 'lmb' }
    },
    {
        path: '**',
        redirectTo: '/notfound',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
