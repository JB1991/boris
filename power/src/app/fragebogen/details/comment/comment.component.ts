import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, Task } from '@app/fragebogen/formapi.model';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    @Input() form: Form;
    @Input() tasks: Array<Task>;
    @Input() taskTotal = 0;
    @Input() taskPerPage = 5;

    @ViewChild('commentmodal') public modal: ModalminiComponent;
    public tasknr = -1;
    public comment: string;

    constructor(public alerts: AlertsService,
        public formapi: FormAPIService) {
    }

    ngOnInit() {
    }

    /**
     * Opens make task modal
     * @param i Task index
     */
    public open(i: number) {
        // check data
        if (i < 0 || i >= this.tasks.length) {
            throw new Error('invalid i');
        }

        // open
        this.comment = this.tasks[i].description;
        this.tasknr = i;
        this.modal.open($localize`Kommentar`);
    }

    /**
     * Closes make task modal
     */
    public close() {
        this.modal.close();
        this.tasknr = -1;
        this.comment = '';
    }

    /**
     * Saves comment
     */
    public save() {
        // check data
        if (this.tasknr < 0 || this.tasknr >= this.tasks.length) {
            throw new Error('invalid i');
        }

        const queryParams: Object = {
            description: this.comment,
        };

        // save
        this.formapi.updateTask(this.tasks[this.tasknr].id, {
            description: this.comment,
        }).then(() => {
            // success
            this.tasks[this.tasknr].description = this.comment;
            this.close();
        }).catch((error: Error) => {
            // failed to create task
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
