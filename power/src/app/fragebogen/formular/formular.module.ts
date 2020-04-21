import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularRoutingModule } from './formular-routing.module';
import { FormularComponent } from './formular.component';
import { EditFormularComponent } from './edit-formular/edit-formular.component';

@NgModule({
  declarations: [
    FormularComponent,
    EditFormularComponent,
  ],
  imports: [
    CommonModule,
    FormularRoutingModule,
  ]
})
export class FormularModule { }
