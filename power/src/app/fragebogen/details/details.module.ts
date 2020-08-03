import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DetailsRoutingModule } from './details-routing.module';
import { StorageService } from './storage.service';
import { DetailsComponent } from './details.component';
import { MaketaskComponent } from './maketask/maketask.component';
import { PublishComponent } from './publish/publish.component';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

@NgModule({
  declarations: [
    DetailsComponent,
    MaketaskComponent,
    PublishComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    SurveyjsModule,
  ],
  providers: [
    StorageService
  ]
})
export class DetailsModule { }
