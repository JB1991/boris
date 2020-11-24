import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';

import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import {Form, User} from '@app/fragebogen/formapi.model';
import { AuthService } from '@app/shared/auth/auth.service';

@Component({
    selector: 'power-forms-details-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    @Output() out = new EventEmitter<{
        id: string;
        tags: Array<string>;
        groups: Array<string>;
        owner: string;
    }>();
    @Input() public availableTags: Array<string>;
    @Input() public availableGroups: Array<string>;
    @Input() public availableUsers: Array<User>;
    @ViewChild('settingsmodal') public modal: ModalminiComponent;

    public form: Form;

    constructor(public auth: AuthService) {
        this.form = {owner: {}};
    }

    /**
     * Opens settings modal
     */
    public open(form: Form) {
        if (!form.tags) {
            form.tags = [];
        }
        if (!form.groups) {
            form.groups = [];
        }
        if (!form.owner) {
            form.owner = {
                id: '',
                name: '',
            };
        }
        this.form = JSON.parse(JSON.stringify(form));
        this.modal.open($localize`Einstellungen`);
    }
}
