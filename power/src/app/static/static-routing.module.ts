import {DatenschutzComponent} from './datenschutz/datenschutz.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from './start/start.component';
import {ImpressumComponent} from '@app/static/impressum/impressum.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'datenschutz',
    component: DatenschutzComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {
}
