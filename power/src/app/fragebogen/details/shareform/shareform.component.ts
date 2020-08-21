import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';

@Component({
	selector: 'power-forms-details-shareform',
	templateUrl: './shareform.component.html',
	styleUrls: ['./shareform.component.scss']
})
export class ShareformComponent implements OnInit {
	@ViewChild('modalshareform') public modal: ModalDirective;

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
        let form = this.storage.form;

        this.storage.updateForm(form.id, form.tags, form.owners, form.readers).subscribe((data) => {
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
