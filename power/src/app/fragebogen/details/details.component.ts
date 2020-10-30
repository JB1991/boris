import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PreviewComponent } from '@app/fragebogen/surveyjs/preview/preview.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { FormAPIService, GetTasksParams } from '../formapi.service';
import { TaskStatus, TaskSortField, Form, Task, User, Access } from '../formapi.model';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { PaginationComponent } from 'ngx-bootstrap/pagination';

@Component({
    selector: 'power-forms-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
    @ViewChild('commentmodal') public modal: ModalminiComponent;
    @ViewChild('pagination') pagination: PaginationComponent;

    public id: string;

    public availableTags: Array<string>;

    public form: Form;
    public owner: User;
    public tasks: Array<Task>;
    public taskTotal = 0;
    public taskPerPage = 5;
    public taskPage = 1;
    public taskPageSizes: Array<number> = [];

    public taskStatus: TaskStatus | 'all' = 'all';
    public taskSort: TaskSortField = 'updated';
    public taskSortOrder: 'asc' | 'desc' = 'desc';

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

    async ngOnInit() {
        this.availableTags = await this.formapi.getTags();

        if (this.id) {
            // load data
            this.updateForm(true);
            this.updateTasks();
        } else {
            // missing id
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }
    }

    /**
     * Load form data
     * @param id Form id
     */
    public async updateForm(navigate: boolean) {
        if (!this.id) {
            throw new Error('id is required');
        }
        try {
            this.loadingscreen.setVisible(true);
            const result = await this.formapi.getForm(this.id, {
                fields: ['all'],
                'owner-fields': ['all'],
            });
            this.form = result.form;
            this.owner = result.owner;
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            this.loadingscreen.setVisible(false);

            if (navigate) {
                this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            }
            return;
        }
    }

    public resetService() {
        this.form = null;
        this.tasks = [];
        this.taskTotal = 0;
        this.taskPerPage = 5;
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
        this.formapi.deleteForm(this.form.id).then(() => {
            // success
            this.alerts.NewAlert('success', $localize`Formular gelöscht`,
                $localize`Das Formular wurde erfolgreich gelöscht.`);
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }).catch((error: Error) => {
            // failed to delete form
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, $localize`Bitte löschen Sie zuvor die zugehörigen Antworten`);
            console.log(error);
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
        this.formapi.updateForm(this.form.id, {}, { status: 'cancelled' }).then(r => {
            this.form = r.form;
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
    /* istanbul ignore next */
    public getCSV() {
        alert($localize`Für den nachfolgenden CSV-Download bitte die UTF-8 Zeichenkodierung verwenden.`);

        // load csv results
        this.formapi.getCSV(this.form.id).then(result => {
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
        if (i < 0 || i >= this.tasks.length) {
            throw new Error('invalid i');
        }

        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie diese Antwort wirklich löschen?`)) {
            return;
        }

        // delete task
        this.formapi.deleteTask(this.tasks[i].id).then(() => {
            this.tasks.splice(i, 1);
            this.alerts.NewAlert('success', $localize`Antwort gelöscht`,
                $localize`Die Antwort wurde erfolgreich gelöscht.`);
            if (this.tasks.length === 0) {
                this.updateTasks();
            }
        }).catch((error: Error) => {
            // failed to delete task
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        });
    }

    public changeTaskSort(sort: 'id' | 'pin' | 'created') {
        if (this.taskSort === sort) {
            if (this.taskSortOrder === 'asc') {
                this.taskSortOrder = 'desc';
            } else {
                this.taskSortOrder = 'asc';
            }
        } else {
            this.taskSortOrder = 'asc';
        }
        this.taskSort = sort;
        this.updateTasks();
    }

    /**
     * Opens preview of task results
     * @param i Number of task
     */
    public async openTask(i: number) {
        // check data
        if (i < 0 || i >= this.tasks.length) {
            throw new Error('invalid i');
        }
        try {
            const r = await this.formapi.getTask(this.tasks[i].id, { fields: ['content'] });
            this.preview.open('display', r.task.content);
        } catch (error) {
            // failed to delete task
            this.alerts.NewAlert('danger', $localize`Öffnen fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        }
    }

    /**
     * Exports form to json
     */
    /* istanbul ignore next */
    public exportForm() {
        // load form
        this.formapi.getForm(this.form.id, { fields: ['content'] }).then(result => {
            // download json
            const pom = document.createElement('a');
            const encodedURIComponent = encodeURIComponent(JSON.stringify(result.form.content));
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

    // tslint:disable-next-line: max-func-body-length
    public async updateTasks() {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetTasksParams = {
                fields: ['id', 'pin', 'description', 'status', 'created', 'updated'],
                filter: { 'has-form-with': { id: this.id } },
                limit: this.taskPerPage,
                offset: (this.taskPage - 1) * this.taskPerPage,
                sort: { orderBy: { field: this.taskSort }, order: this.taskSortOrder },
            };
            if (this.taskStatus !== 'all') {
                params.filter = {
                    status: this.taskStatus,
                };
            }
            const r = await this.formapi.getTasks(params);
            this.taskTotal = r['total-tasks'];
            this.tasks = r.tasks;
            let maxPages = Math.floor(this.taskTotal / 5) + 1;
            if (maxPages > 10) {
                maxPages = 10;
                this.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            } else {
                this.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            }
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
        }
    }

    public updateFormEvent(event: { id: string, tags: Array<string> }) {
        this.formapi.updateForm(event.id, {}, { tags: event.tags }).then(() => {
            this.updateForm(false);
        }).catch((error) => {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Änderung am Formular fehlgeschlagen`, error.toString());
        });
    }

    public publishFormEvent(event: { id: string, access: Access }) {
        this.formapi.updateForm(event.id, {}, { access: event.access, status: 'published' }).then(() => {
            this.updateForm(false);
        }).catch((error) => {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Veröffentlichen des Formulars fehlgeschlagen`, error.toString());
        });
    }

    public commentTaskEvent(event: { id: string, description: string }) {
        this.formapi.updateTask(event.id, {}, { description: event.description }).then(() => {
            this.updateTasks();
        }).catch((error) => {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Änderung des Kommentars fehlgeschlagen`, error.toString());
        });
    }

    /**
     * createTaskEvent
     */
    // tslint:disable-next-line: max-func-body-length
    public async createTaskEvent(event: { amount: number, copy: boolean }) {
        const pinList: Array<string> = [];
        try {
            const r = await this.formapi.createTask(this.form.id, {
                fields: ['id', 'pin', 'description', 'status', 'created', 'updated'],
            }, {}, event.amount);
            for (const task of r.tasks) {
                pinList.push(task.pin);
            }
            this.taskSort = 'created';
            this.taskSortOrder = 'desc';
            this.pagination.page = 1;
            this.updateTasks();
            // copy to clipboard
            if (event.copy) {
                const selBox = document.createElement('textarea');
                selBox.style.position = 'fixed';
                selBox.style.left = '0';
                selBox.style.top = '0';
                selBox.style.opacity = '0';
                selBox.value = pinList.join('\n');
                document.body.appendChild(selBox);
                selBox.focus();
                selBox.select();
                document.execCommand('copy');
                document.body.removeChild(selBox);
            }
        } catch (error) {
            // failed to create task
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, error.toString());
            console.log(error);
            return;
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
