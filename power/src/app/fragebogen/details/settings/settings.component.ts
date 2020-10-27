import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { FormAPIService } from '../../formapi.service';
import { Form, Task, User } from '@app/fragebogen/formapi.model';

@Component({
    selector: 'power-forms-details-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    @Input() form: Form;
    @Input() tasks: Array<Task>;
    @Input() taskTotal = 0;
    @Input() taskPerPage = 5;

    @ViewChild('settingsmodal') public modal: ModalminiComponent;

    public tagList = [];

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
        this.tagList = Object.assign([], this.form.tags);
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
        this.formapi.updateForm(this.form.id, {
            tags: this.tagList,
        }).then(result => {
            //     // success
            this.form.tags = this.tagList;
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
