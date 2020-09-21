import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { StorageService } from './storage.service';
import { PreviewComponent } from '@app/fragebogen/surveyjs/preview/preview.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { FormAPIService } from '../formapi.service';

@Component({
    selector: 'power-forms-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
    @ViewChild('preview') public preview: PreviewComponent;

    constructor(public titleService: Title,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public storage: StorageService,
        public formapi: FormAPIService,
        public auth: AuthService) {
        this.titleService.setTitle($localize`Formular Details - POWER.NI`);
        this.storage.resetService();
    }

    ngOnInit() {
        // get id
        this.loadingscreen.setVisible(true);
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            // load data
            this.loadData(id);
        } else {
            // missing id
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }
    }

    /**
     * Load form data
     * @param id Form id
     */
    public async loadData(id: string) {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        try {
            const result = await this.formapi.getInternForm(id);
            this.storage.form = result;
            if(result.status !== 'created') {
                const results = await this.formapi.getInternFormTasks(id);
                this.storage.tasksList = results.data;
                this.storage.tasksCountTotal = results.total;
                this.storage.tasksList = this.storage.tasksList.slice(0, this.storage.tasksPerPage);

                this.loadingscreen.setVisible(false);
            } else {
                this.loadingscreen.setVisible(false);
            }
        } catch(error) {
            // failed to load form
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            console.log(error);
            return;
        }
    }

    /**
     * Deletes form
     */
    public deleteForm() {
        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie dieses Formular wirklich löschen?`)) {
            return;
        }

        // delete form
        this.formapi.deleteInternForm(this.storage.form.id).then(() => {
            // success
            this.alerts.NewAlert('success', $localize`Formular gelöscht`,
                $localize`Das Formular wurde erfolgreich gelöscht.`);
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }, (error: Error) => {
            // failed to delete form
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error['statusText']);
            // console.log(error);
            return;
        });
    }

    /**
     * Archives form
     */
    public archiveForm() {
        // Ask user to confirm achivation
        if (!confirm($localize`Möchten Sie dieses Formular wirklich archivieren?\n\
Dies lässt sich nicht mehr umkehren!`)) {
            return;
        }

        const queryParams: Object = {
            cancel: true,
        };


        // archive form
        this.formapi.updateInternForm(this.storage.form.id, null, queryParams).then(result => {
            this.storage.form = result;
            this.alerts.NewAlert('success', $localize`Formular archiviert`,
                $localize`Das Formular wurde erfolgreich archiviert.`);
        }, (error: Error) => {
            // failed to publish form
            this.alerts.NewAlert('danger', $localize`Archivieren fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }

    /**
     * Downloads results as csv
     */
    public getCSV() {
        // load csv results
       this.formapi.getInternFormCSV(this.storage.form.id).then(result => {
            const blob = new Blob([result.toString()], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, 'results.csv');
            } else {
                const pom = document.createElement('a');
                pom.setAttribute('href', url);
                pom.setAttribute('download', 'results.csv');
                pom.click();
            }
       }, (error: Error) => {
            // failed to load results
            this.alerts.NewAlert('danger', $localize`Download fehlgeschlagen`, error['statusText']);
            console .log(error);
            return;
        });
    }

    /**
     * Deletes an existing task
     * @param i Number of task
     */
    public deleteTask(i: number) {
        // check data
        if (i < 0 || i >= this.storage.tasksList.length) {
            throw new Error('invalid i');
        }

        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie diese Antwort wirklich löschen?`)) {
            return;
        }

        // delete task
        this.formapi.deleteInternTask(this.storage.tasksList[i].id).then(result => {
            this.storage.tasksList.splice(i, 1);
            this.alerts.NewAlert('success', $localize`Antwort gelöscht`,
                $localize`Die Antwort wurde erfolgreich gelöscht.`);
        }, (error: Error) => {
            // failed to delete task
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }

    /**
     * Opens preview of task results
     * @param i Number of task
     */
    public openTask(i: number) {
        // check data
        if (i < 0 || i >= this.storage.tasksList.length) {
            throw new Error('invalid i');
        }

        this.preview.open('display', this.storage.tasksList[i].content);
    }

    /**
     * Exports form to json
     */
    /* istanbul ignore next */
    public exportForm() {
        // load form
        this.formapi.getInternForm(this.storage.form.id).then(result => {
            // download json
            const pom = document.createElement('a');
            const encodedURIComponent = encodeURIComponent(JSON.stringify(result.content));
            const href = 'data:application/octet-stream;charset=utf-8,' + encodedURIComponent;
            pom.setAttribute('href', href);
            pom.setAttribute('download', 'formular.json');
            pom.click();
        }).catch((error) => {
            // failed to load form
            this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
            throw error;
        });
    }

    /**
     * Triggered by the pagination event, when the user changes the page
     * @param event Contains the page number and the number of items per page
     */
    public tasksPageChanged(event: PageChangedEvent): void {
        const limit = event.itemsPerPage;
        const offset = (event.page - 1) * event.itemsPerPage;
        this.loadTasksFromAPI(limit, offset);
    }

    /**
     * Load the list of tasks from the Form-API
     * @param limit The maximum number of forms to be loaded
     * @param offset The number of the first form to be loaded
     */
    private loadTasksFromAPI(limit?: number, offset?: number) {
        const queryParams: Object = {
            limit: limit,
            offset: offset
        };
        this.formapi.getInternFormTasks(this.storage.form.id, queryParams).then(result => {
            this.storage.tasksList = result.data;
            this.loadingscreen.setVisible(false);
        }, (error: Error) => {
            // failed to load tags
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms'], { replaceUrl: true });
            console.log(error);
            return;
        });
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
