import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Task } from '@app/fragebogen/formapi.model';

import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

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
