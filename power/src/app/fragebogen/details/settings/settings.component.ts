import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    @ViewChild('modalsettings') public modal: ModalDirective;

    public tagList = [];
    public ownerList = [];
    public readerList = [];

    constructor(public modalService: BsModalService,
        public router: Router,
        public alerts: AlertsService,
        public storage: StorageService,
        public formapi: FormAPIService) {
    }

    ngOnInit() {
    }

    /**
     * Opens settings modal
     */
    public open() {
        this.tagList = Object.assign([], this.storage.form.tags);
        this.ownerList = Object.assign([], this.storage.form.owners);
        this.readerList = Object.assign([], this.storage.form.readers);
        this.modal.show();
    }

    /**
     * Closes settings modal
     */
    public close() {
        this.modal.hide();
    }

    /**
     * Update Form with tags, owners and readers
     */
    public updateForm() {
        
        const queryParams: Object = {
            tags: this.tagList.toString(),
            owners: this.ownerList.toString(),
            readers: this.readerList.toString()
        };

        this.formapi.updateInternForm(this.storage.form.id, null, queryParams).then(result => {
            //     // success
            console.log(result)
            this.storage.form = result;
            this.alerts.NewAlert('success', $localize`Formular gespeichert`,
                $localize`Das Formular wurde erfolgreich gespeichert.`);
            this.close();
        }, (error: Error) => {
            // failed to update form
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }

}
