import { Component, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService, GetFormsParams } from '../../formapi.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { Form, User } from '../../formapi.model';

@Component({
    selector: 'power-forms-dashboard-newform',
    templateUrl: './newform.component.html',
    styleUrls: ['./newform.component.css'],
})
export class NewformComponent {
    @ViewChild('newformmodal') public modal: ModalminiComponent;
    @Input() public tags: Array<string>;
    @Input() public forms: Array<Form>;
    @Input() public formOwners: Record<string, User>;
    @Input() public formPerPage: number;

    public title: string;
    public service = '';
    public template = '';
    public tagList = [];
    public templateList = [];
    public searchText: string;
    public test: string;

    constructor(public router: Router, public alerts: AlertsService, public formAPI: FormAPIService) { }

    /**
     * Opens new form modal
     */
    public open() {
        this.searchText = '';
        this.title = '';
        this.tagList = [];
        this.templateList = [];
        this.modal.open($localize`Neues Formular`);
    }

    /**
     * Closes new form modal
     */
    public close() {
        this.modal.close();
    }

    /**
     * Set template to selected id
     * @param event selected typeahead item
     */
    public setTemplate(event: TypeaheadMatch) {
        this.template = event.item.id;
    }

    /**
     * Fetch all Templates (Forms with id, title) for the current search text
     */
    public fetchTemplates() {
        const queryParams: GetFormsParams = {
            fields: ['id', 'content', 'owner'],
            'owner-fields': ['id', 'name'],
            filter: {
                or: [
                    { content: { path: ['title', 'de'], text: { lower: true, contains: this.searchText } } },
                    { content: { path: ['title', 'default'], text: { lower: true, contains: this.searchText } } },
                ],
            },
            extra: ['title.de', 'title.default'],
            sort: { orderBy: { field: 'content', path: ['title', 'default'] }, order: 'asc' },
        };

        this.formAPI
            .getForms(queryParams)
            .then((result) => {
                this.templateList = result.forms;
            })
            .catch((error: Error) => {
                // failed to load form
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
                console.log(error);
                return;
            });
    }

    /**
     * Creates new formular
     */
    public NewForm() {
        // check if form is filled incorrect
        if (!this.title) {
            this.alerts.NewAlert('danger', $localize`Ungültige Einstellungen`,
                $localize`Bitte geben Sie einen Titel an.`);
            return;
        }
        // load template
        if (this.template) {
            this.formAPI
                .getForm(this.template, {
                    fields: ['content'],
                })
                .then((data) => {
                    this.makeForm(data.form.content);
                    this.close();
                })
                .catch((error) => {
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
                });
            return;
        }
        // make new form
        this.makeForm(JSON.parse(JSON.stringify(defaultTemplate)));
        this.close();
    }

    /**
     * Makes new formular
     * @param template SurveyJS Template
     */
    // tslint:disable-next-line: max-func-body-length
    public async makeForm(template: any) {
        try {
            if (!template) {
                throw new Error('template is required');
            }
            if (!this.title) {
                throw new Error('title is required');
            }
            template.title.default = this.title;
            const response = await this.formAPI.createForm({ tags: this.tagList, content: template, access: 'public' });

            const resp = await this.formAPI.getForm(response.id, {
                fields: ['id', 'owner', 'tags', 'access', 'group', 'status', 'created', 'updated'],
                'owner-fields': ['id', 'name', 'given-name', 'family-name', 'groups'],
                extra: ['title.de', 'title.default'],
            });
            this.forms.unshift(resp.form);
            this.formOwners[resp.owner.id] = resp.owner;
            if (this.forms.length > this.formPerPage) {
                this.forms.pop();
            }
        } catch (error) {
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, error.toString());
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
