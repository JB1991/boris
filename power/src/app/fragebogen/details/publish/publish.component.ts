import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '../../formapi.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { Access, Form, Task, User } from '../../formapi.model';

@Component({
    selector: 'power-forms-details-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
    @Input() form: Form;
    @Input() owner: User;
    @Input() tasks: Array<Task>;
    @Input() taskTotal = 0;
    @Input() taskPerPage = 5;

    @ViewChild('publishmodal') public modal: ModalminiComponent;
    public access: Access = 'pin8';

    constructor(public alerts: AlertsService,
        public formapi: FormAPIService) {
    }

    ngOnInit() {
    }

    /**
     * Opens modal
     */
    public open() {
        this.modal.open($localize`Veröffentlichen`);
    }

    /**
     * Closes modal
     */
    public close() {
        this.modal.close();
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

        this.formapi.updateForm(this.form.id, {
            access: this.access,
            status: 'published',
        }).then(result => {
            // success
            this.form.status = 'published';
            this.alerts.NewAlert('success', $localize`Formular veröffentlicht`,
                $localize`Das Formular wurde erfolgreich veröffentlicht.`);
            this.close();
        }).catch((error: Error) => {
            // failed to publish form
            this.alerts.NewAlert('danger', $localize`Veröffentlichen fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
