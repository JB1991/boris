import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    @Input() public data = {
        form: null,
        tasksList: [],
        tasksCountTotal: 0,
        tasksPerPage: 5,
    };
    @ViewChild('modalcomment') public modal: ModalDirective;
    public tasknr = -1;
    public comment: string;

    constructor(public modalService: BsModalService,
        public alerts: AlertsService,
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
        if (i < 0 || i >= this.data.tasksList.length) {
            throw new Error('invalid i');
        }

        // open
        this.comment = this.data.tasksList[i].description;
        this.tasknr = i;
        this.modal.show();
    }

    /**
     * Closes make task modal
     */
    public close() {
        this.modal.hide();
        this.tasknr = -1;
        this.comment = '';
    }

    /**
     * Saves comment
     */
    public save() {
        // check data
        if (this.tasknr < 0 || this.tasknr >= this.data.tasksList.length) {
            throw new Error('invalid i');
        }

        const queryParams: Object = {
            description: this.comment,
        };

        // save
        this.formapi.updateInternTask(this.data.tasksList[this.tasknr].id, null, queryParams).then(result => {
            // success
            this.data.tasksList[this.tasknr].description = result.description;
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
