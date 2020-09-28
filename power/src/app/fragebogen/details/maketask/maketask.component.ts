import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-maketask',
    templateUrl: './maketask.component.html',
    styleUrls: ['./maketask.component.css']
})
export class MaketaskComponent implements OnInit {
    @Input() public data = {
        form: null,
        tasksList: [],
        tasksCountTotal: 0,
        tasksPerPage: 5,
        taskTotal: 0,
        taskPage: 1,
        taskPageSizes: [],
    };
    @ViewChild('modalmaketask') public modal: ModalDirective;
    public amount = 1;
    public pinList = [];
    public copy = false;

    constructor(public modalService: BsModalService,
        public alerts: AlertsService,
        public storage: StorageService,
        public formapi: FormAPIService) {
    }

    ngOnInit() {
    }

    /**
     * Opens make task modal
     */
    public open() {
        this.amount = 1;
        this.pinList = [];
        this.modal.show();
    }

    /**
     * Closes make task modal
     */
    public close() {
        this.modal.hide();
    }

    /**
     * Generates PINs
     */
    public Generate() {
        // check amount bounds
        if (this.amount < 1 || this.amount > 100) {
            this.alerts.NewAlert('danger', $localize`Ungültige Eingabe`,
                $localize`Bitte generieren Sie nur zwischen 1 und 100 PINs.`);
            throw new Error('Invalid bounds for variable amount');
        }

        const queryParams: Object = {
            number: this.amount
        };
        // make pins
        this.formapi.createInternFormTasks(this.data.form.id, this.data.form, queryParams).then((result) => {
            // success
            for (let i = 0; i < result.data.length; i++) {
                this.pinList.push(result.data[i].pin);
                this.data.tasksList.splice(0, 0, result.data[i]);
                this.data.tasksCountTotal++;
                this.data.tasksList = this.data.tasksList.slice(0, this.data.tasksPerPage);
            }
            let maxPages = Math.floor(this.data.tasksCountTotal / 5) + 1;
            if (maxPages > 10) {
                maxPages = 10;
                this.data.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            } else {
                this.data.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            }
            // copy to clipboard
            if (this.copy) {
                const selBox = document.createElement('textarea');
                selBox.style.position = 'fixed';
                selBox.style.left = '0';
                selBox.style.top = '0';
                selBox.style.opacity = '0';
                selBox.value = this.pinList.join('\n');
                document.body.appendChild(selBox);
                selBox.focus();
                selBox.select();
                document.execCommand('copy');
                document.body.removeChild(selBox);
            }

            // close modal
            this.close();
        }).catch((error: Error) => {
            // failed to create task
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
