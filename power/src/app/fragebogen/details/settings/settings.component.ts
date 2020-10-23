import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    @Input() public data = {
        form: null,
        tasksList: [],
        tasksCountTotal: 0,
        tasksPerPage: 5,
    };
    @ViewChild('settingsmodal') public modal: ModalminiComponent;

    public tagList = [];
    public ownerList = [];
    public readerList = [];

    constructor(public router: Router,
        public alerts: AlertsService,
        public formapi: FormAPIService) {
    }

    ngOnInit() {
    }

    /**
     * Opens settings modal
     */
    public open() {
        this.tagList = Object.assign([], this.data.form.tags);
        this.ownerList = Object.assign([], this.data.form.owners);
        this.readerList = Object.assign([], this.data.form.readers);
        this.modal.open($localize`Einstellungen`);
    }

    /**
     * Closes settings modal
     */
    public close() {
        this.modal.close();
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

        this.formapi.updateInternForm(this.data.form.id, null, queryParams).then(result => {
            //     // success
            this.data.form = result;
            this.alerts.NewAlert('success', $localize`Formular gespeichert`,
                $localize`Das Formular wurde erfolgreich gespeichert.`);
            this.close();
        }).catch((error: Error) => {
            // failed to update form
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }

}
