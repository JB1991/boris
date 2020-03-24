import {NgModule} from '@angular/core';

import {StaticRoutingModule} from './static-routing.module';
import {StartComponent} from './start/start.component';
import {ImpressumComponent} from './impressum/impressum.component';
import {DatenschutzComponent} from './datenschutz/datenschutz.component';
import {SharedModule} from '@app/shared/shared.module';

@NgModule({
  imports: [
    StaticRoutingModule,
    SharedModule
  ],
  declarations: [StartComponent, ImpressumComponent, DatenschutzComponent]
})
export class StaticModule {
}
