import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    @ViewChild('modalcomment') public modal: ModalDirective;
    public tasknr = -1;
    public comment: string;

    constructor(public modalService: BsModalService,
        public alerts: AlertsService,
        public storage: StorageService,
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
        if (i < 0 || i >= this.storage.tasksList.length) {
            throw new Error('invalid i');
        }

        // open
        this.comment = this.storage.tasksList[i].description;
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
        if (this.tasknr < 0 || this.tasknr >= this.storage.tasksList.length) {
            throw new Error('invalid i');
        }

        const queryParams: Object = {
            description: this.comment,
        };

        // save
        this.formapi.updateInternTask(this.storage.tasksList[this.tasknr].id, null, queryParams).then(result => {
            // success
            this.storage.tasksList[this.tasknr].description = result.description;
            this.close();
        }, (error: Error) => {
            // failed to create task
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
