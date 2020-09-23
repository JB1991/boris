import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '../../formapi.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { DataService } from '../data.service';

@Component({
    selector: 'power-forms-dashboard-newform',
    templateUrl: './newform.component.html',
    styleUrls: ['./newform.component.css']
})
export class NewformComponent implements OnInit {
    @ViewChild('modalnewform') public modal: ModalDirective;
    public title: string;
    public service = '';
    public template = '';
    public tagList = [];
    public templateList = [];
    public searchText: string;
    public test: string;

    constructor(public modalService: BsModalService,
        public router: Router,
        public alerts: AlertsService,
        public formAPI: FormAPIService,
        public data: DataService) {
    }

    ngOnInit() {
    }

    /**
     * Opens new form modal
     */
    public open() {
        this.searchText = '';
        this.title = '';
        this.tagList = [];
        this.templateList = [];
        this.modal.show();
    }

    /**
     * Closes new form modal
     */
    public close() {
        this.modal.hide();
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
        const queryParams: Object = {
            'title-contains': this.searchText,
            fields: 'id,title',
            sort: 'title',
            order: 'asc'
        };

        this.formAPI.getInternForms(queryParams).then(result => {
            this.templateList = result.data;
        }).catch((error: Error) => {
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
        if (document.getElementsByClassName('is-invalid').length > 0) {
            this.alerts.NewAlert('danger', $localize`Ungültige Einstellungen`,
                $localize`Einige Einstellungen sind fehlerhaft und müssen zuvor korrigiert werden.`);
            return;
        }

        // load template
        if (this.template) {
            this.formAPI.getInternForm(this.template).then((data) => {
                this.makeForm(data.content);
                this.close();
            }).catch((error) => {
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
    public async makeForm(template: any) {
        try {
            if (!template) {
                throw new Error('template is required');
            }
            if (!this.title) {
                throw new Error('title is required');
            }
            template.title.default = this.title;
            const response = await this.formAPI.createInternForm(template, {tags: this.tagList});
            this.data.forms.push(response);
        } catch (error) {
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, error.toString());
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
