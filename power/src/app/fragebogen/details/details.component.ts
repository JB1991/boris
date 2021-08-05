import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PreviewComponent } from '@app/fragebogen/surveyjs/preview/preview.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { FormAPIService, GetTasksParams, GetTaskParams } from '../formapi.service';
import { TaskStatus, TaskField, Form, Task, User, Access } from '../formapi.model';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { SEOService } from '@app/shared/seo/seo.service';

/* eslint-disable max-lines */
@Component({
    selector: 'power-forms-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    @ViewChild('commentmodal') public modal: ModalminiComponent;
    @ViewChild('pagination') pagination: PaginationComponent;
    @ViewChild('preview') public preview: PreviewComponent;

    public id: string;

    public availableTags: Array<string>;
    public availableGroups: Array<string>;
    public availableUsers: Array<User>;

    public form: Form;
    public owner: User;
    public tasks: Array<Task>;
    public taskTotal = 0;
    public taskPerPage = 5;
    public taskPage = 1;
    public taskPageSizes: Array<number> = [];

    public taskStatus: TaskStatus | 'all' = 'all';
    public taskSort: TaskField = 'updated';
    public taskSortDesc = true;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formapi: FormAPIService,
        public auth: AuthService,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Formular Details - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Ausfüllen von online Formularen und Anträgen` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Formulare, Anträge` });
    }

    ngOnInit(): void {
        // get id
        this.loadingscreen.setVisible(true);
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            // load data
            this.updateForm(true);
            this.updateTasks();
            this.updateTags();
            this.updateGroups();
            this.updateUsers();
        } else {
            // missing id
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }
    }

    /**
     * Load form data
     * @param navigate True to navigate back to dashboard
     * @returns Promise
     */
    public async updateForm(navigate: boolean): Promise<void> {
        if (!this.id) {
            throw new Error('id is required');
        }

        try {
            this.loadingscreen.setVisible(true);
            const r = await this.formapi.getForm(this.id, {
                fields: ['id', 'extract', 'content', 'status', 'access', 'created', 'updated', 'tags', 'owner.name', 'owner.id', 'groups'],
                extract: ['title.de', 'title.default'],
            });
            this.form = r.form;
            this.owner = r.form.owner;
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));

            /* istanbul ignore else */
            if (navigate) {
                this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            }
        }
    }

    /**
     * Deletes form
     * @returns Promise
     */
    public async deleteForm(): Promise<void> {
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
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Archives form
     * @returns Promise
     */
    public async archiveForm(): Promise<void> {
        try {
            // Ask user to confirm achivation
            if (!confirm($localize`Möchten Sie dieses Formular wirklich archivieren?\n\
        Dies lässt sich nicht mehr umkehren!`)) {
                return;
            }
            await this.formapi.updateForm(this.form.id, { status: 'cancelled' });
            this.form.status = 'cancelled';
            this.alerts.NewAlert('success', $localize`Formular archiviert`,
                $localize`Das Formular wurde erfolgreich archiviert.`);
        } catch (error) {
            // failed to publish form
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Archivieren fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /* istanbul ignore next */
    /**
     * Downloads results as csv
     * @returns Promise
     */
    public async getCSV(): Promise<void> {
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
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Download fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Deletes an existing task
     * @param i Number of task
     * @returns Promise
     */
    public async deleteTask(i: number): Promise<void> {
        try {
            // check data
            if (i < 0 || i >= this.tasks.length) {
                throw new Error('invalid i');
            }
            // Ask user to confirm deletion
            if (!confirm($localize`Möchten Sie diese Antwort wirklich löschen?`)) {
                return;
            }
            await this.formapi.deleteTask(this.tasks[i].id);
            this.tasks.splice(i, 1);
            this.alerts.NewAlert('success', $localize`Antwort gelöscht`,
                $localize`Die Antwort wurde erfolgreich gelöscht.`);
        } catch (error) {
            // failed to delete task
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
        if (this.tasks.length === 0) {
            await this.updateTasks();
        }
    }

    /**
     * Generate a new pin for a task
     * @param i Number of task
     * @returns Promise
     */
    public async newPin(i: number): Promise<void> {
        try {
            // check data
            if (i < 0 || i >= this.tasks.length) {
                throw new Error('invalid i');
            }
            // Ask user to confirm deletion
            if (!confirm($localize`Möchten Sie eine neue Pin generieren?`)) {
                return;
            }
            await this.formapi.updateTask(this.tasks[i].id, { status: 'created' });
            await this.updateTasks();
            this.alerts.NewAlert('success', $localize`Neue Pin generiert`,
                $localize`Die neue Pin wurde erfolgreich generiert.`);
        } catch (error) {
            // failed to delete task
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Neue Pin generieren fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
        if (this.tasks.length === 0) {
            await this.updateTasks();
        }
    }

    /**
     * Make task completed
     * @param i Number of task
     * @returns Promise
     */
    public async completeTask(i: number): Promise<void> {
        try {
            // check data
            if (i < 0 || i >= this.tasks.length) {
                throw new Error('invalid i');
            }
            // Ask user to confirm deletion
            if (!confirm($localize`Möchten Sie die Antwort abschließen?`)) {
                return;
            }
            await this.formapi.updateTask(this.tasks[i].id, { status: 'completed' });
            await this.updateTasks();
            this.alerts.NewAlert('success', $localize`Antwort abgeschlossen`,
                $localize`Die Antwort wurde erfolgreich abgeschlossen.`);
        } catch (error) {
            // failed to delete task
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Antwort abschließen fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
        if (this.tasks.length === 0) {
            await this.updateTasks();
        }
    }

    /**
     * Opens preview of task results
     * @param i Number of task
     * @returns Promise
     */
    public async openTask(i: number): Promise<void> {
        try {
            // check data
            if (i < 0 || i >= this.tasks.length) {
                throw new Error('invalid i');
            }

            const params: GetTaskParams = {
                fields: ['content'],
            };

            const r = await this.formapi.getTask(this.tasks[i].id, params);

            this.preview.open('display', r.task.content);
        } catch (error) {
            // failed to delete task
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Öffnen fehlgeschlagen`, $localize`Die Vorschau konnte nicht geöffnet werden.`);
        }
    }

    /* istanbul ignore next */
    /**
     * Exports form to json
     */
    public exportForm(): void {
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
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));
        });
    }

    /**
     * Updates tags
     * @returns Promise
     */
    public async updateTags(): Promise<void> {
        try {
            const r = await this.formapi.getTags({});
            this.availableTags = r.tags;
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Updates groups
     * @returns Promise
     */
    public async updateGroups(): Promise<void> {
        try {
            const r = await this.formapi.getGroups({});
            this.availableGroups = r.groups;
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Updates users
     * @returns Promise
     */
    public async updateUsers(): Promise<void> {
        try {
            const r = await this.formapi.getUsers({ fields: ['id', 'name'] });
            this.availableUsers = r.users;
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Updates tasks
     * @returns Promise
     */
    public async updateTasks(): Promise<void> {
        this.loadingscreen.setVisible(true);
        const params: GetTasksParams = {
            fields: ['id', 'pin', 'description', 'created', 'updated', 'status'],
            filter: { form: { id: this.id } },
            limit: Number(this.taskPerPage),
            offset: (this.taskPage - 1) * this.taskPerPage,
            sort: { field: this.taskSort, desc: this.taskSortDesc },
        };
        if (this.taskStatus !== 'all') {
            params.filter = {
                and: [
                    params.filter,
                    {
                        status: this.taskStatus,
                    }
                ]
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
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Sorts tasks
     * @param sort Sort filter
     */
    public changeTaskSort(sort: TaskField): void {
        if (this.taskSort === sort) {
            this.taskSortDesc = !this.taskSortDesc;
        } else {
            this.taskSortDesc = false;
        }
        this.taskSort = sort;
        this.updateTasks();
    }

    /**
     * Update forms event
     * @param event Event
     * @param event.id Form id
     * @param event.tags Form tags
     * @param event.groups Form groups
     * @param event.owner Form owner
     * @returns Promise
     */
    public async updateFormEvent(event: { id: string; tags?: Array<string>; groups?: Array<string>; owner?: string }
    ): Promise<void> {
        try {
            const b: any = {};
            if (event.tags) {
                b.tags = event.tags;
            }
            if (event.groups) {
                b.groups = event.groups;
            }
            if (event.owner) {
                b.owner = event.owner;
            }
            await this.formapi.updateForm(event.id, b);
            this.updateForm(true);
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Änderung am Formular fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Publish forms event
     * @param event Event
     * @param event.id Task id
     * @param event.access Task access level
     * @returns Promise
     */
    public async publishFormEvent(event: { id: string; access: Access }): Promise<void> {
        try {
            await this.formapi.updateForm(event.id, { access: event.access, status: 'published' });
            this.updateForm(false);
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Veröffentlichen des Formulars fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Comment task event
     * @param event Event
     * @param event.id Task id
     * @param event.description Task comment
     * @returns Promise
     */
    public async commentTaskEvent(event: { id: string; description: string }): Promise<void> {
        try {
            await this.formapi.updateTask(event.id, { description: event.description });
            this.updateTasks();
        } catch (error) {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Änderung des Kommentars fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }

    /**
     * Creates tasks
     * @param event Event
     * @param event.amount Amount of tasks to create
     * @param event.copyvalue Copy pins to clipboard
     * @returns Promise
     */
    public async createTaskEvent(event: { amount: number; copyvalue: boolean }): Promise<void> {
        try {
            const r = await this.formapi.createTask(this.form.id, {}, event.amount);
            this.taskSort = 'created';
            this.taskSortDesc = true;
            this.pagination.page = 1;
            this.updateTasks();
            // copy to clipboard
            /* istanbul ignore else */
            if (event.copyvalue) {
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
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, this.formapi.getErrorMessage(error));
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
