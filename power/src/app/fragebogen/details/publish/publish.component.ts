import { Component, ViewChild, Output, EventEmitter } from '@angular/core';

import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { Access } from '../../formapi.model';

@Component({
    selector: 'power-forms-details-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.scss']
})
export class PublishComponent {
    @Output() out = new EventEmitter<{
        id: string;
        access: Access;
    }>();
    public id: string;

    @ViewChild('publishmodal') public modal: ModalminiComponent;
    public access: Access = 'pin8';

    /**
     * Opens modal
     */
    public open(id: string) {
        this.id = id;
        this.modal.open($localize`Veröffentlichen`);
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

        this.out.emit({
            id: this.id,
            access: this.access,
        });
        this.id = '';
        this.access = 'pin8';
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
