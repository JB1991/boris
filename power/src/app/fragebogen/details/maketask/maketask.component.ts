import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

@Component({
    selector: 'power-forms-details-maketask',
    templateUrl: './maketask.component.html',
    styleUrls: ['./maketask.component.css']
})
export class MaketaskComponent implements OnInit {
    @ViewChild('modalmaketask') public modal: ModalDirective;
    public amount = 1;
    public pinList = [];
    public copy = false;

    constructor(public modalService: BsModalService,
        public alerts: AlertsService,
        public storage: StorageService) {
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

        // make pins
        this.storage.createTask(this.storage.form.id, this.amount).subscribe((data) => {
            // check for error
            if (!data || data['error'] || !data['data']) {
                const alertText = (data && data['error'] ? data['error'] : this.storage.form.id);
                this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, alertText);

                console.log('Could not create task: ' + alertText);
                return;
            }

            // success
            for (let i = 0; i < data['data'].length; i++) {
                this.pinList.push(data['data'][i].pin);
                this.storage.tasksList.splice(0, 0, data['data'][i]);
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
        }, (error: Error) => {
            // failed to create task
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
