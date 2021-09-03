import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';

import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { Form, User } from '@app/fragebogen/formapi.model';
import { AuthService } from '@app/shared/auth/auth.service';

@Component({
    selector: 'power-forms-details-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    @Output() public out = new EventEmitter<{
        id: string;
        tags: string[];
        groups: string[];
        owner: string;
    }>();
    @Input() public availableTags = new Array<string>();
    @Input() public availableGroups = new Array<string>();
    @Input() public availableUsers = new Array<User>();
    @ViewChild('settingsmodal') public modal?: ModalminiComponent;

    public old?: Form;
    public tags = new Array<string>();
    public groups = new Array<string>();
    public owner = '';

    constructor(public auth: AuthService) { }

    /**
     * Opens settings modal
     * @param form Form
     */
    public open(form: Form): void {
        if (!form.tags) {
            form.tags = new Array<string>();
        }
        if (!form.groups) {
            form.groups = new Array<string>();
        }
        if (!form.owner) {
            form.owner = {
                id: '',
                name: ''
            };
        }
        this.old = form;
        this.tags = JSON.parse(JSON.stringify(form.tags));
        this.groups = JSON.parse(JSON.stringify(form.groups));
        this.owner = JSON.parse(JSON.stringify(form.owner.id));
        if (this.modal) {
            this.modal.open($localize`Einstellungen`);
        }
    }
}
