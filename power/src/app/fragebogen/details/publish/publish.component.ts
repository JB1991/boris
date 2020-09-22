import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
    @ViewChild('modalpublish') public modal: ModalDirective;
    public pin = 'pin8';
    public accesstime = 60;

    constructor(public modalService: BsModalService,
        public alerts: AlertsService,
        public storage: StorageService,
        public formapi: FormAPIService) {
    }

    ngOnInit() {
    }

    /**
     * Opens modal
     */
    public open() {
        this.modal.show();
    }

    /**
     * Closes modal
     */
    public close() {
        this.modal.hide();
    }

    /**
     * Publishes form
     */
    public Publish() {
        // Ask user to confirm achivation
        if (!confirm($localize`Möchten Sie dieses Formular wirklich veröffentlichen?\n\
Das Formular lässt sich danach nicht mehr bearbeiten.\n\
Dies lässt sich nicht mehr umkehren!`)) {
            return;
        }

        const queryParams: Object = {
            access: this.pin,
            'access-minutes': this.accesstime,
            publish: true,
        };
        this.formapi.updateInternForm(this.storage.form.id, null, queryParams).then(result => {
            // success
            this.storage.form = result;
            this.alerts.NewAlert('success', $localize`Formular veröffentlicht`,
                $localize`Das Formular wurde erfolgreich veröffentlicht.`);
            this.close();
        }, (error: Error) => {
            // failed to publish form
            this.alerts.NewAlert('danger', $localize`Veröffentlichen fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
