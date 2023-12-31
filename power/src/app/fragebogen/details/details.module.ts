import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '@app/shared/shared.module';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';
import { MaketaskComponent } from './maketask/maketask.component';
import { PublishComponent } from './publish/publish.component';
import { SettingsComponent } from './settings/settings.component';
import { CommentComponent } from './comment/comment.component';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';


@NgModule({
    declarations: [
        DetailsComponent,
        MaketaskComponent,
        PublishComponent,
        CommentComponent,
        SettingsComponent
    ],
    imports: [
        DetailsRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
        PaginationModule.forRoot(),
        SurveyjsModule
    ]
})
export class DetailsModule { }
/* vim: set expandtab ts=4 sw=4 sts=4: */
