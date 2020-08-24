import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

import { defaultTemplate } from '@app/fragebogen/editor/data';

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

    constructor(public modalService: BsModalService,
        public router: Router,
        public alerts: AlertsService,
        public storage: StorageService) {
    }

    ngOnInit() {
    }

    /**
     * Opens new form modal
     */
    public open() {
        this.tagList = [];
        this.modal.show();
    }

    /**
     * Closes new form modal
     */
    public close() {
        this.modal.hide();
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
            this.storage.loadForm(this.template).subscribe((data) => {
                // check for error
                if (!data || data['error'] || !data['data']) {
                    const alertText = (data && data['error'] ? data['error'] : this.template);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

                    console.log('Could not load form: ' + alertText);
                    return;
                }

                // make new form
                this.makeForm(data['data']['content']);
            }, (error: Error) => {
                // failed to load form
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
                console.log(error);
                return;
            });
            return;
        }

        // make new form
        this.makeForm(JSON.parse(JSON.stringify(defaultTemplate)));
    }

    /**
     * Makes new formular
     * @param template SurveyJS Template
     */
    public makeForm(template: any) {
        // check data
        if (!template) {
            throw new Error('template is required');
        }
        if (!this.title) {
            throw new Error('title is required');
        }
        template.title.default = this.title;

        this.storage.createForm(template, this.tagList.join(',')).subscribe((data) => {
            // check for error
            if (!data || data['error'] || !data['data']) {
                const alertText = (data && data['error'] ? data['error'] : '');
                this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, alertText);

                console.log('Could not create form: ' + alertText);
                return;
            }

            // Success
            this.storage.formsList.push(data['data']);
            this.alerts.NewAlert('success', $localize`Erfolgreich erstellt`,
                $localize`Das Formular wurde erfolgreich erstellt.`);
            this.router.navigate(['/forms/details', data['data'].id], { replaceUrl: true });
        }, (error: Error) => {
            // failed to create form
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
