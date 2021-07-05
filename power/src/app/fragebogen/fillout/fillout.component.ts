import { Component, HostListener, ViewChild, Inject, LOCALE_ID, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { surveyLocalization } from 'survey-angular';

import { FormAPIService } from '../formapi.service';
import { WrapperComponent } from '../surveyjs/wrapper.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { Bootstrap4_CSS } from '@app/fragebogen/surveyjs/style';
import { PublicForm, PublicTask } from '../formapi.model';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-forms-fillout',
    templateUrl: './fillout.component.html',
    styleUrls: ['./fillout.component.scss']
})
export class FilloutComponent implements AfterViewInit {
    @ViewChild('wrapper') public wrapper: WrapperComponent;
    public language = 'de';
    public submitted = false;
    public languages = surveyLocalization.localeNames;

    public pin = '';
    public form: PublicForm;

    public data = {
        css_style: JSON.parse(JSON.stringify(Bootstrap4_CSS)),
        UnsavedChanges: false
    };

    public task: PublicTask;

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formapi: FormAPIService,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Formulare - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Ausfüllen von online Formularen und Anträgen` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Formulare, Anträge` });
    }

    ngAfterViewInit(): void {
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

    /**
     * canDeactivate event handler
     * @returns True if can leave page
     */
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
    public setLanguage(): void {
        this.wrapper.survey.locale = this.language;
    }

    /**
     * Loads form
     * @param id Form id
     */
    public loadForm(id: string): void {
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
     * Submits task
     * @param id Form pin
     * @param result Task result
     */
    public submitTask(id: string, result: any): void {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!result) {
            throw new Error('no data provided');
        }
        result.options.showDataSaving($localize`Die Ergebnisse werden auf dem Server gespeichert, dies kann einige Sekunden dauern.`);
        this.submitted = true;

        this.formapi.createPublicTask(id, result.result).then(() => {
            this.setUnsavedChanges(false);
            result.options.showDataSavingClear();
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, $localize`Ihre Daten wurden erfolgreich gespeichert.`);
        }).catch((error: Error) => {
            // failed to complete task
            console.error(error);
            result.options.showDataSavingError($localize`Das Speichern auf dem Server ist fehlgeschlagen.`);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, this.formapi.getErrorMessage(error));
        });
    }

    /**
     * Loads form data
     * @returns Promise
     */
    public async loadData(): Promise<void> {
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
    public submit(result: any): void {
        // check data
        if (!result) {
            throw new Error('no data provided');
        }
        result.options.showDataSaving($localize`Die Ergebnisse werden auf dem Server gespeichert, dies kann einige Sekunden dauern.`);
        this.submitted = true;

        // complete
        this.formapi.updatePublicTask(this.pin, result.result, true).then(() => {
            this.setUnsavedChanges(false);
            result.options.showDataSavingClear();
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
    public progress(result: any): void {
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
    public changed(result: any): void {
        this.setUnsavedChanges(true);
    }

    /**
     * Set unsaved changes state
     * @param state true or false
     */
    public setUnsavedChanges(state: boolean): void {
        this.data.UnsavedChanges = state;
    }

    /**
     * Returns unsaved changes state
     * @returns True if unsaved changes exists
     */
    public getUnsavedChanges(): boolean {
        return this.data.UnsavedChanges;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
