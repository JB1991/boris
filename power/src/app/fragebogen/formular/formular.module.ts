import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularRoutingModule } from './formular-routing.module';
import { EditFormularComponent } from './edit-formular/edit-formular.component';

@NgModule({
  declarations: [
    EditFormularComponent,
  ],
  imports: [
    CommonModule,
    FormularRoutingModule,
  ]
})
export class FormularModule { }
