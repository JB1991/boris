import { Component, OnInit, HostListener, ViewChild, Inject, LOCALE_ID } from '@angular/core';
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

@Component({
    selector: 'power-forms-fillout',
    templateUrl: './fillout.component.html',
    styleUrls: ['./fillout.component.css']
})
export class FilloutComponent implements OnInit {
    @ViewChild('wrapper') public wrapper: WrapperComponent;
    public language = 'de';
    public submitted = false;
    public languages = Survey.surveyLocalization.localeNames;

    public data = {
        css_style: JSON.parse(JSON.stringify(Bootstrap4_CSS)),
        task: null,
        form: null,
        UnsavedChanges: false
    };

    constructor(@Inject(LOCALE_ID) public locale: string,
        public titleService: Title,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formapi: FormAPIService) {
        this.titleService.setTitle($localize`Formulare - POWER.NI`);
        this.resetService();
    }

    ngOnInit() {
        // get pin
        this.loadingscreen.setVisible(true);
        const pin = this.route.snapshot.paramMap.get('pin');
        if (pin) {
            // load data
            this.loadData(pin);
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


    // eslint-disable-next-line 
    public loadForm(id: string) {
        // load form by id
        this.formapi.getPublicForm(id).then(result => {
            // store form
            this.data.form = result;
            this.language = this.data.form.content.locale;

            // check if user language exists in survey
            /* istanbul ignore next */
            setTimeout(() => {
                if (this.wrapper && this.wrapper.survey.getUsedLocales().includes(this.locale)) {
                    this.language = this.locale;
                    this.setLanguage();
                }
            }, 100);

            // display form
            this.loadingscreen.setVisible(false);
        }).catch((error: Error) => {
            // failed to load form
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms'], { replaceUrl: true });
            console.log(error);
            return;
        });
    }

    /**
     * submit Task
     * @param id Form pin
     * @param result Task result
     */

    // eslint-disable-next-line
    public submitTask(id: string, result: any) {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!result) {
            throw new Error('no data provided');
        }

        const queryParams: Object = {
            submit: true,
        };
        this.formapi.createPublicTask(id, result.result, queryParams).then(() => {
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, $localize`Ihre Daten wurden erfolgreich gespeichert.`);
        }).catch((error: Error) => {
            // failed to complete task
            result.options.showDataSavingError($localize`Das Speichern auf dem Server ist fehlgeschlagen` + `: {error.toString()}`);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error.toString());
            return;
        });
    }

    /**
     * Load form data
     * @param pin Task pin
     * @param factor Task factor
     */
    public loadData(pin: string, factor: string = null) {
        // check data
        if (!pin) {
            throw new Error('pin is required');
        }

        this.formapi.getPublicAccess(pin, factor).then(result => {
            // store task data
            this.data.task = result;

            // load form by id
            this.loadForm(this.data.task['form-id']);
        }).catch((error: Error) => {
            // failed to load task
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms'], { replaceUrl: true });
            console.log(error);
            return;
        });
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

        const queryParams: Object = {
            submit: true
        };
        // complete
        this.formapi.updatePublicTask(this.data.task.id, result.result, queryParams).then(() => {
            this.setUnsavedChanges(false);
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, $localize`Ihre Daten wurden erfolgreich gespeichert.`);
        }).catch((error: Error) => {
            // failed to complete task
            result.options.showDataSavingError($localize`Das Speichern auf dem Server ist fehlgeschlagen` + `: {error.toString()}`);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error.toString());
            console.log(error);
            return;
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
        this.formapi.updatePublicTask(this.data.task.id, result).then(() => {
            this.setUnsavedChanges(false);
        }).catch((error: Error) => {
            // failed to save task
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error.toString());
            console.log(error);
            return;
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
        this.data.task = null;
        this.data.form = null;
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
