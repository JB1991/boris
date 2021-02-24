import { Component, HostListener, ViewChild, Inject, LOCALE_ID, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import * as Survey from 'survey-angular';

import { FormAPIService } from '../formapi.service';
import { WrapperComponent } from '../surveyjs/wrapper.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { Bootstrap4_CSS } from '@app/fragebogen/surveyjs/style';
import { PublicForm, PublicTask } from '../formapi.model';

@Component({
    selector: 'power-forms-fillout',
    templateUrl: './fillout.component.html',
    styleUrls: ['./fillout.component.scss']
})
export class FilloutComponent implements AfterViewInit {
    @ViewChild('wrapper') public wrapper: WrapperComponent;
    public language = 'de';
    public submitted = false;
    public languages = Survey.surveyLocalization.localeNames;

    public pin = '';
    public form: PublicForm;

    public data = {
        css_style: JSON.parse(JSON.stringify(Bootstrap4_CSS)),
        UnsavedChanges: false
    };

    public task: PublicTask;

    constructor(@Inject(LOCALE_ID) public locale: string,
        public titleService: Title,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formapi: FormAPIService) {
        this.titleService.setTitle($localize`Formulare - Immobilienmarkt.NI`);
        this.resetService();
    }

    ngAfterViewInit() {
        // get pin
        this.pin = this.route.snapshot.paramMap.get('pin');
        if (this.pin) {
            // load data
            this.loadData();
        } else {
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                this.loadForm(id);
            } else {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    @HostListener('window:beforeunload') canDeactivate(): boolean {
        // on test environment skip
        if (!environment.production) {
            return true;
        }
        return !this.getUnsavedChanges();
    }

    /**
     * Set language
     */
    public setLanguage() {
        this.wrapper.survey.locale = this.language;
    }

    public loadForm(id: string) {
        // load form by id
        this.loadingscreen.setVisible(true);
        this.formapi.getPublicForm(id, { fields: ['id', 'content', 'access'] }).then(result => {
            // store form
            this.form = result.form;
            this.language = this.form.content.locale;

            // check if user language exists in survey
            /* istanbul ignore next */
            if (this.wrapper && this.wrapper.survey.getUsedLocales().includes(this.locale)) {
                this.language = this.locale;
                this.setLanguage();
            }

            // display form
            this.loadingscreen.setVisible(false);
        }).catch((error: Error) => {
            // failed to load form
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));

            this.router.navigate(['/forms'], { replaceUrl: true });
        });
    }

    /**
     * submit Task
     * @param id Form pin
     * @param result Task result
     */
    public submitTask(id: string, result: any) {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!result) {
            throw new Error('no data provided');
        }

        this.formapi.createPublicTask(id, result.result).then(() => {
            this.setUnsavedChanges(false);
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, $localize`Ihre Daten wurden erfolgreich gespeichert.`);
        }).catch((error: Error) => {
            // failed to complete task
            console.error(error);
            result.options.showDataSavingError($localize`Das Speichern auf dem Server ist fehlgeschlagen.`);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, this.formapi.getErrorMessage(error));
        });
    }

    /**
     * Load form data
     */
    public async loadData() {
        if (!this.pin) {
            throw new Error('pin is required');
        }

        try {
            this.loadingscreen.setVisible(true);
            const t = await this.formapi.getPublicTask(this.pin, { fields: ['id', 'content', 'form.id'] });
            this.task = t.task;
            const f = await this.formapi.getPublicForm(t.task.form.id, { fields: ['id', 'content', 'access'] });
            this.form = f.form;
            this.language = f.form.content.locale;
            this.loadingscreen.setVisible(false);
        } catch (error) {
            // failed to load task
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));

            this.router.navigate(['/forms'], { replaceUrl: true });
        }
    }

    /**
     * Submits form after completing it
     * @param result Data
     */
    public submit(result: any) {
        // check data
        if (!result) {
            throw new Error('no data provided');
        }
        this.submitted = true;

        // complete
        this.formapi.updatePublicTask(this.pin, result.result, true).then(() => {
            this.setUnsavedChanges(false);
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, $localize`Ihre Daten wurden erfolgreich gespeichert.`);
        }).catch((error: Error) => {
            // failed to complete task
            console.error(error);
            result.options.showDataSavingError($localize`Das Speichern auf dem Server ist fehlgeschlagen.`);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, this.formapi.getErrorMessage(error));
        });
    }

    /**
     * Receives form data to save it
     * @param result Data
     */
    public progress(result: any) {
        // check data
        if (!result) {
            throw new Error('no data provided');
        }
        if (this.submitted) {
            return;
        }

        // interim results
        this.formapi.updatePublicTask(this.pin, result, false).then(() => {
            this.setUnsavedChanges(false);
        }).catch((error: Error) => {
            // failed to save task
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, this.formapi.getErrorMessage(error));
        });
    }

    /**
     * Receives change events
     * @param result Data
     */
    public changed(result: any) {
        this.setUnsavedChanges(true);
    }

    public resetService() {
        this.data.css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));
        this.pin = '';
        this.form = null;
        this.data.UnsavedChanges = false;
    }

    /**
     * Sets unsaved changes state
     * @param state true or false
     */
    public setUnsavedChanges(state: boolean) {
        this.data.UnsavedChanges = state;
    }

    /**
     * Returns true if unsaved changes exists
     */
    public getUnsavedChanges(): boolean {
        return this.data.UnsavedChanges;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
