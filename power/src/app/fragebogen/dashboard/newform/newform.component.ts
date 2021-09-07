import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService, GetFormsParams } from '../../formapi.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

@Component({
    selector: 'power-forms-dashboard-newform',
    templateUrl: './newform.component.html',
    styleUrls: ['./newform.component.scss']
})
export class NewformComponent {
    @ViewChild('modal') public modal?: ModalminiComponent;

    @Output() public out = new EventEmitter<string>();

    @Input() public tags = new Array<string>();

    public title = '';

    public service = '';

    public template = '';

    public tagList = new Array<string>();

    public templateList = new Array<string>();

    public searchText = '';

    public test = '';

    constructor(public router: Router, public alerts: AlertsService, public formAPI: FormAPIService) { }

    /**
     * Opens new form modal
     */
    public open(): void {
        this.searchText = '';
        this.title = '';
        this.tagList = new Array<string>();
        this.templateList = new Array<string>();
        if (this.modal) {
            this.modal.open($localize`Neues Formular`);
        }
    }

    /**
     * Fetch all Templates (Forms with id, title) for the current search text
     */
    public fetchTemplates(): void {
        const queryParams: GetFormsParams = {
            fields: ['id', 'content', 'owner.name', 'extract'],
            filter: {
                extract: { lower: true, contains: this.searchText }
            },
            extract: ['title.de', 'title.default'],
            sort: { field: 'extract', desc: false }
        };

        this.formAPI
            .getForms(queryParams)
            .then((result) => {
                this.templateList = result.forms.map((f) => (f.extract ? f.extract : '')).filter((title) => title !== '');
            })
            .catch((error: Error) => {
                // failed to load form
                console.error(error);
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formAPI.getErrorMessage(error));
            });
    }

    /**
     * Creates new formular
     */
    public NewForm(): void {
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
                    fields: ['content']
                })
                .then((data) => {
                    void this.makeForm(data.form.content);
                    if (this.modal) {
                        this.modal.close();
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formAPI.getErrorMessage(error));
                });
            return;
        }

        // make new form
        void this.makeForm(JSON.parse(JSON.stringify(defaultTemplate)));
        if (this.modal) {
            this.modal.close();
        }
    }

    /**
     * Makes new formular
     * @param tpl SurveyJS Template
     */
    public async makeForm(tpl: any): Promise<void> {
        try {
            if (!tpl) {
                throw new Error('template is required');
            }
            if (!this.title) {
                throw new Error('title is required');
            }
            this.escapeTitle();
            tpl.title.default = this.title;
            const r = await this.formAPI.createForm({ tags: this.tagList, content: tpl, access: 'public' });
            this.out.emit(r.id);
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, this.formAPI.getErrorMessage(error));
        }
    }

    /**
     * Escapes Title
     */
    public escapeTitle(): void {
        this.title = this.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
