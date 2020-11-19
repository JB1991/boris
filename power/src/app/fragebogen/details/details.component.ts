import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PreviewComponent } from '@app/fragebogen/surveyjs/preview/preview.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { FormAPIService, GetTasksParams } from '../formapi.service';
import { TaskStatus, TaskField, Form, Task, User, Access } from '../formapi.model';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { PaginationComponent } from 'ngx-bootstrap/pagination';

/* eslint-disable max-lines */
@Component({
    selector: 'power-forms-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
    @ViewChild('commentmodal') public modal: ModalminiComponent;
    @ViewChild('pagination') pagination: PaginationComponent;
    @ViewChild('preview') public preview: PreviewComponent;

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
    public taskSort: TaskField = 'updated';
    public taskSortDesc: boolean;

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
        if (this.id) {
            // load data
            this.updateForm(true);
            this.updateTasks();
            this.updateTags();
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
        try {
            if (!this.id) {
                throw new Error('id is required');
            }
            this.loadingscreen.setVisible(true);
            const r = await this.formapi.getForm(this.id, {
                fields: ['id', 'extract', 'content', 'status', 'access', 'created', 'updated', 'tags', 'owner.name', 'groups'],
                extract: ['title.de', 'title.default'],
            });
            this.form = r.form;
            this.owner = r.form.owner;
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            this.loadingscreen.setVisible(false);
            if (navigate) {
                this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            }
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
    public async deleteForm() {
        try {
            // Ask user to confirm deletion
            if (!confirm($localize`Möchten Sie dieses Formular wirklich löschen?`)) {
                return;
            }
            // success
            await this.formapi.deleteForm(this.form.id);
            this.alerts.NewAlert('success', $localize`Formular gelöscht`,
                $localize`Das Formular wurde erfolgreich gelöscht.`);
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });

        } catch (error) {
            // failed to delete form
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, $localize`Bitte löschen Sie zuvor die zugehörigen Antworten`);
            console.log(error);
            return;
        }
    }

    /**
     * Archives form
     */
    public async archiveForm() {
        try {
            // Ask user to confirm achivation
            if (!confirm($localize`Möchten Sie dieses Formular wirklich archivieren?\n\
        Dies lässt sich nicht mehr umkehren!`)) {
                return;
            }
            await this.formapi.updateForm(this.form.id, { status: 'cancelled' });
            this.alerts.NewAlert('success', $localize`Formular archiviert`,
                $localize`Das Formular wurde erfolgreich archiviert.`);
        } catch (error) {
            // failed to publish form
            this.alerts.NewAlert('danger', $localize`Archivieren fehlgeschlagen`, (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            console.log(error);
            return;
        }
    }

    /**
     * Downloads results as csv
     */
    /* istanbul ignore next */
    public async getCSV() {
        try {
            alert($localize`Für den nachfolgenden CSV-Download bitte die UTF-8 Zeichenkodierung verwenden.`);
            const r = await this.formapi.getCSV(this.form.id);
            const blob = new Blob([r], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, 'results.csv');
            } else {
                const pom = document.createElement('a');
                pom.setAttribute('href', url);
                pom.setAttribute('download', 'results.csv');
                pom.click();
            }
        } catch (error) {
            // failed to load results
            this.alerts.NewAlert('danger', $localize`Download fehlgeschlagen`, (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            console.log(error);
            return;
        }
    }

    /**
     * Deletes an existing task
     * @param i Number of task
     */
    public async deleteTask(i: number) {
        try {
            // check data
            if (i < 0 || i >= this.tasks.length) {
                throw new Error('invalid i');
            }
            // Ask user to confirm deletion
            if (!confirm($localize`Möchten Sie diese Antwort wirklich löschen?`)) {
                return;
            }
            const r = await this.formapi.deleteTask(this.tasks[i].id);
            this.tasks.splice(i, 1);
            this.alerts.NewAlert('success', $localize`Antwort gelöscht`,
                $localize`Die Antwort wurde erfolgreich gelöscht.`);
        } catch (error) {
            // failed to delete task
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            console.log(error);
        }
        if (this.tasks.length === 0) {
            this.updateTasks();
        }
    }

    /**
     * Opens preview of task results
     * @param i Number of task
     */
    public openTask(i: number) {
        try {
            // check data
            if (i < 0 || i >= this.tasks.length) {
                throw new Error('invalid i');
            }
            this.preview.open('display', this.tasks[i].content);
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
            const blob = new Blob([JSON.stringify(result.form.content)], { type: 'application/json;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, 'formular.json');
            } else {
                const pom = document.createElement('a');
                pom.setAttribute('href', url);
                pom.setAttribute('download', 'formular.json');
                pom.click();
            }
        }).catch((error: Error) => {
            // failed to load form
            this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            throw error;
        });
    }

    public async updateTags() {
        try {
            const r = await this.formapi.getTags();
            this.availableTags = r.tags;
        } catch (error) {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
        }
    }

    // tslint:disable-next-line: max-func-body-length
    public async updateTasks() {
        this.loadingscreen.setVisible(true);
        const params: GetTasksParams = {
            fields: ['id', 'pin', 'description', 'created', 'updated'],
            filter: { form: { id: this.id } },
            limit: Number(this.taskPerPage),
            offset: (this.taskPage - 1) * this.taskPerPage,
            sort: { field: this.taskSort, desc: this.taskSortDesc },
        };
        if (this.taskStatus !== 'all') {
            params.filter = {
                status: this.taskStatus,
            };
        }
        try {
            const r = await this.formapi.getTasks(params);
            this.tasks = r.tasks;
            this.taskTotal = r.total;
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
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
        }
    }

    public changeTaskSort(sort: TaskField) {
        if (this.taskSort === sort) {
            this.taskSortDesc = !this.taskSortDesc;
        } else {
            this.taskSortDesc = false;
        }
        this.taskSort = sort;
        this.updateTasks();
    }

    public async updateFormEvent(event: { id: string; tags: Array<string> }) {
        try {
            await this.formapi.updateForm(event.id, { tags: event.tags });
            this.updateForm(false);
        } catch (error) {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Änderung am Formular fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
        }
    }

    public async publishFormEvent(event: { id: string; access: Access }) {
        try {
            await this.formapi.updateForm(event.id, { access: event.access, status: 'published' });
            this.updateForm(false);
        } catch (error) {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Veröffentlichen des Formulars fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
        }
    }

    public async commentTaskEvent(event: { id: string; description: string }) {
        try {
            await this.formapi.updateTask(event.id, { description: event.description });
            this.updateTasks();
        } catch (error) {
            console.log(error);
            this.alerts.NewAlert('danger', $localize`Änderung des Kommentars fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
        }
    }

    /**
     * createTaskEvent
     */
    public async createTaskEvent(event: { amount: number; copy: boolean }) {
        try {
            const r = await this.formapi.createTask(this.form.id, {}, event.amount);
            this.taskSort = 'created';
            this.taskSortDesc = true;
            this.pagination.page = 1;
            this.updateTasks();
            // copy to clipboard
            if (event.copy) {
                const selBox = document.createElement('textarea');
                selBox.style.position = 'fixed';
                selBox.style.left = '0';
                selBox.style.top = '0';
                selBox.style.opacity = '0';
                selBox.value = r.pins.join('\n');
                document.body.appendChild(selBox);
                selBox.focus();
                selBox.select();
                document.execCommand('copy');
                document.body.removeChild(selBox);
            }
        } catch (error) {
            // failed to create task
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            console.log(error);
            return;
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
