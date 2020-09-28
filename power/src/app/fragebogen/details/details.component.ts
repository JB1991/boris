import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
    public data: any = {
        form: null,
        tasksList: [],
        tasksCountTotal: 0,
        tasksPerPage: 5,
        taskTotal: 0,
        taskPage: 1,
        taskPageSizes: [],
    };

    public id: string;

    public taskStatus?: 'created' | 'accessed' | 'submitted' | 'all';
    public taskSort: 'id' | 'pin' | 'created' | 'submitted' = 'submitted';
    public taskOrder: 'asc' | 'desc' = 'desc';

    @ViewChild('preview') public preview: PreviewComponent;
    component: any;

    constructor(public titleService: Title,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formapi: FormAPIService,
        public auth: AuthService) {
        this.titleService.setTitle($localize`Formular Details - POWER.NI`);
        this.resetService();
        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.updateTasks(true);
        this.loadingscreen.setVisible(true);
        // get idform
        if (this.id) {
            // load data
            this.loadData(this.id);
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
            this.data.form = result;
            if (result.status !== 'created') {
                const results = await this.formapi.getInternFormTasks(id);
                this.data.tasksList = results.data;
                this.data.tasksCountTotal = results.total;
                this.data.tasksList = this.data.tasksList.slice(0, this.data.tasksPerPage);
                this.loadingscreen.setVisible(false);
            } else {
                this.loadingscreen.setVisible(false);
            }
        } catch (error) {
            // failed to load form
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            console.log(error);
            return;
        }
    }

    public resetService() {
        this.data.form = null;
        this.data.tasksList = [];
        this.data.tasksCountTotal = 0;
        this.data.tasksPerPage = 5;
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
        this.formapi.deleteInternForm(this.data.form.id).then(() => {
            // success
            this.alerts.NewAlert('success', $localize`Formular gelöscht`,
                $localize`Das Formular wurde erfolgreich gelöscht.`);
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }).catch((error: Error) => {
            // failed to delete form
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error.toString());
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
        this.formapi.updateInternForm(this.data.form.id, null, queryParams).then(result => {
            this.data.form = result;
            this.alerts.NewAlert('success', $localize`Formular archiviert`,
                $localize`Das Formular wurde erfolgreich archiviert.`);
        }).catch((error: Error) => {
            // failed to publish form
            this.alerts.NewAlert('danger', $localize`Archivieren fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }

    /**
     * Downloads results as csv
     */
    public getCSV() {
        // load csv results
        this.formapi.getInternFormCSV(this.data.form.id).then(result => {
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
        }).catch((error: Error) => {
            // failed to load results
            this.alerts.NewAlert('danger', $localize`Download fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }

    /**
     * Deletes an existing task
     * @param i Number of task
     */
    public deleteTask(i: number) {
        // check data
        if (i < 0 || i >= this.data.tasksList.length) {
            throw new Error('invalid i');
        }

        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie diese Antwort wirklich löschen?`)) {
            return;
        }

        // delete task
        this.formapi.deleteInternTask(this.data.tasksList[i].id).then(() => {
            this.data.tasksList.splice(i, 1);
            this.alerts.NewAlert('success', $localize`Antwort gelöscht`,
                $localize`Die Antwort wurde erfolgreich gelöscht.`);
            if (this.data.tasksList.length === 0) {
                this.updateTasks(false);
            }; 
        }).catch((error: Error) => {
            // failed to delete task
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }

    public changeTaskSort(sort: 'id' | 'pin' | 'created' ) {
        if (this.taskSort === sort) {
            if (this.taskOrder === 'asc') {
                this.taskOrder = 'desc';
            } else {
                this.taskOrder = 'asc';
            }
        } else {
            this.taskOrder = 'asc';
        }
        this.taskSort = sort;
        this.updateTasks(false);
    }

    /**
     * Opens preview of task results
     * @param i Number of task
     */
    public openTask(i: number) {
        // check data
        if (i < 0 || i >= this.data.tasksList.length) {
            throw new Error('invalid i');
        }

        this.preview.open('display', this.data.tasksList[i].content);
    }

    /**
     * Exports form to json
     */
    /* istanbul ignore next */
    public exportForm() {
        // load form
        this.formapi.getInternForm(this.data.form.id).then(result => {
            // download json
            const pom = document.createElement('a');
            const encodedURIComponent = encodeURIComponent(JSON.stringify(result.content));
            const href = 'data:application/octet-stream;charset=utf-8,' + encodedURIComponent;
            pom.setAttribute('href', href);
            pom.setAttribute('download', 'formular.json');
            pom.click();
        }).catch((error: Error) => {
            // failed to load form
            this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error.toString());
            throw error;
        });
    }

    public async updateTasks(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params = {
                limit: this.data.tasksPerPage,
                offset: (this.data.taskPage - 1) * this.data.tasksPerPage,
                sort: this.taskSort,
                order: this.taskOrder,
            };
            if (this.taskStatus !== undefined && this.taskStatus !== 'all') {
                params['status'] = this.taskStatus;
            }
            const response = await this.formapi.getInternFormTasks(this.id, params);
            this.data.tasksCountTotal = response.total;
            this.data.tasksList = response.data;
            let maxPages = Math.floor(this.data.tasksCountTotal / 5) + 1;
            if (maxPages > 10) {
                maxPages = 10;
                this.data.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            } else {
                this.data.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            }
            this.loadingscreen.setVisible(false);
        } catch (error) {
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
