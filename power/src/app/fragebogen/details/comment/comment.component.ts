import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

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
        public storage: StorageService) {
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

        // save
        this.storage.updateTaskComment(this.storage.tasksList[this.tasknr].id, this.comment).subscribe((data) => {
            // check for error
            if (!data || data['error']) {
                const alertText = (data && data['error'] ? data['error'] : this.tasknr.toString());
                this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, alertText);

                console.log('Could not update task: ' + alertText);
                return;
            }

            // success
            this.storage.tasksList[this.tasknr].description = this.comment;
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
