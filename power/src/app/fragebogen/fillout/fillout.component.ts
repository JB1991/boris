import { Component, OnInit, HostListener, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import * as Survey from 'survey-angular';

import { StorageService } from './storage.service';
import { FormAPIService } from '../formapi.service';
import { WrapperComponent } from '../surveyjs/wrapper.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { contentTemplate } from '@angular-devkit/schematics';

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

    constructor(@Inject(LOCALE_ID) public locale: string,
        public titleService: Title,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public storage: StorageService,
        public formapi: FormAPIService) {
        this.titleService.setTitle($localize`Formulare - POWER.NI`);
        this.storage.resetService();
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
        return !this.storage.getUnsavedChanges();
    }

    
    /**
     * Set language
     */
    public setLanguage() {
        this.wrapper.survey.locale = this.language;
    }

    // tslint:disable-next-line: max-func-body-length
    public loadForm(id: string) {
        // load form by id
        this.formapi.getInternForm(id).then(result => {
            //store form
            this.storage.form = result;
            this.language = this.storage.form.content.locale;

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
        }, (error2: Error) => {
            // failed to load form
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error2['statusText']);
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms'], { replaceUrl: true });
            console.log(error2);
            return;
        });
    }

    /**
     * submit Task
     * @param id Form pin
     * @param result Task result
     */
    
    // tslint:disable-next-line: max-func-body-length
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
        }, (error: Error) => {
            // failed to complete task
            result.options.showDataSavingError($localize`Das Speichern auf dem Server ist fehlgeschlagen: {error['statusText']}`);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error['statusText']);
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
            this.storage.task = result;

            // load form by id
            this.loadForm(this.storage.task['form-id']);
        }, (error: Error) => {
            // failed to load task
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
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
        }
        // complete
        this.formapi.updatePublicTask(this.storage.task.id, result.result, queryParams).then(() => {
            this.storage.setUnsavedChanges(false);
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, $localize`Ihre Daten wurden erfolgreich gespeichert.`);
        }, (error: Error) => {
            // failed to complete task
            result.options.showDataSavingError($localize`Das Speichern auf dem Server ist fehlgeschlagen: {error['statusText']}`);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error['statusText']);
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
        console.log(result);
        // interim results
        this.formapi.updatePublicTask(this.storage.task.id, result).then(() => {
            this.storage.setUnsavedChanges(false);
        }, (error: Error) => {
            // failed to save task
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }


     /**
     * Receives change events
     * @param result Data
     */
    public changed(result: any) {
        this.storage.setUnsavedChanges(true);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
