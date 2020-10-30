import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Form, Task } from '@app/fragebogen/formapi.model';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent {
    @Output() out = new EventEmitter<{
        id: string;
        description: string;
    }>();
    @ViewChild('commentmodal') public modal: ModalminiComponent;

    public id: string;
    public description: string;

    /**
     * Opens make task modal
     * @param i Task index
     */
    public open(task: Task) {
        this.id = task.id;
        this.description = task.description;
        this.modal.open($localize`Kommentar`);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
