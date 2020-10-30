import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
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
export class SettingsComponent {
    @Output() out = new EventEmitter<{
        id: string,
        tags: Array<string>,
    }>();
    @Input() public availableTags: Array<string>;
    @ViewChild('settingsmodal') public modal: ModalminiComponent;

    public form: Form;

    /**
     * Opens settings modal
     */
    public open(form: Form) {
        if (!form.tags) {
            form.tags = [];
        }
        this.form = form;
        this.modal.open($localize`Einstellungen`);
    }
}
