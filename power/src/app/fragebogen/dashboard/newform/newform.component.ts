import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService, GetFormsParams } from '../../formapi.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { Form } from '../../formapi.model';

@Component({
    selector: 'power-forms-dashboard-newform',
    templateUrl: './newform.component.html',
    styleUrls: ['./newform.component.css'],
})
export class NewformComponent {
    @ViewChild('modal') public modal: ModalminiComponent;
    @Output() public out = new EventEmitter<string>();
    @Input() public tags: Array<string>;

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
     * Fetch all Templates (Forms with id, title) for the current search text
     */
    public fetchTemplates() {
        const queryParams: GetFormsParams = {
            fields: ['id', 'content', 'owner.name', 'extract'],
            filter: {
                extract: { lower: true, contains: this.searchText },
            },
            extract: ['title.de', 'title.default'],
            sort: { field: 'extract', desc: false },
        };

        this.formAPI
            .getForms(queryParams)
            .then((result) => {
                this.templateList = result.forms;
            })
            .catch((error: Error) => {
                // failed to load form
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                    (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
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
                    this.modal.close();
                })
                .catch((error) => {
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
                });
            return;
        }
        // make new form
        this.makeForm(JSON.parse(JSON.stringify(defaultTemplate)));
        this.modal.close();
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
            const r = await this.formAPI.createForm({ tags: this.tagList, content: template, access: 'public' });
            this.out.emit(r.id);
        } catch (error) {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
