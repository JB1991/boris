import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Task } from '@app/fragebogen/formapi.model';

import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

@Component({
    selector: 'power-forms-details-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
    @Output() public out = new EventEmitter<{
        id: string;
        description: string;
    }>();
    @ViewChild('commentmodal') public modal?: ModalminiComponent;

    public id = '';
    public description = '';

    /**
     * Opens make task modal
     * @param task Task
     */
    public open(task: Task): void {
        this.id = task.id ? task.id : '';
        this.description = task.description ? task.description : '';
        if (this.modal) {
            this.modal.open($localize`Kommentar`);
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
