import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DetailsRoutingModule } from './details-routing.module';
import { StorageService } from './storage.service';
import { DetailsComponent } from './details.component';
import { MaketaskComponent } from './maketask/maketask.component';
import { PublishComponent } from './publish/publish.component';
import { CommentComponent } from './comment/comment.component';

import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

@NgModule({
    declarations: [
        DetailsComponent,
        MaketaskComponent,
        PublishComponent,
        CommentComponent,
    ],
    imports: [
        DetailsRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ModalModule.forRoot(),
        SurveyjsModule,
    ],
    providers: [
        StorageService
    ]
})
export class DetailsModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
