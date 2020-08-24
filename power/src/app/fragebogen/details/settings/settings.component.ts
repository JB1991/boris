import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';
import { Observable } from 'rxjs';

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
                public storage: StorageService) {
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

        this.storage.updateForm(this.storage.form.id, this.tagList.toString(), this.ownerList.toString(), this.readerList.toString()).subscribe((data) => {
            // check for error
            if (!data || data['error']) {
                const alertText = (data && data['error'] ? data['error'] : this.storage.form.id);
                this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, alertText);

                console.log('Could not update form: ' + alertText);
                return;
            }

            // success
            this.storage.form = data['data'];
            this.alerts.NewAlert('success', $localize`Formular gespeichert`,
                $localize`Das Formular wurde erfolgreich gespeichert.`);
            this.close();
        }, (error: Error) => {
            // failed to update form
            this.alerts.NewAlert('danger', $localize`speichern fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
	}

}
