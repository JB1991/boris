import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxEchartsModule} from 'ngx-echarts';

import {ImmobilienRoutingModule} from './immobilien-routing.module';
import {ImmobilienComponent} from './immobilien/immobilien.component';

import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		ImmobilienRoutingModule,
		NgbModule,
		NgxEchartsModule,
		FormsModule
	],
	declarations: [ImmobilienComponent]
})

export class ImmobilienModule { }
