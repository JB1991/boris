import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DetailsRoutingModule } from './details-routing.module';
import { StorageService } from './storage.service';
import { DetailsComponent } from './details.component';
import { MaketaskComponent } from './maketask/maketask.component';

@NgModule({
  declarations: [
    DetailsComponent,
    MaketaskComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  providers: [
    StorageService
  ]
})
export class DetailsModule { }
