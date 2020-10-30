import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService, GetFormsParams, GetTasksParams } from '../formapi.service';
import { FormStatus, Access, Order, TaskStatus, FormFilter, FormSortField, TaskSortField, Task, Form, User } from '../formapi.model';
import { PaginationComponent } from 'ngx-bootstrap/pagination';

@Component({
    selector: 'power-forms-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
    @ViewChild('formPagination') formPagination: PaginationComponent;

    public tags: Array<string>;

    public forms: Array<Form>;
    public formOwners: Record<string, User>;
    public formTotal: number;
    public formPage = 1;
    public formPerPage = 5;
    public formPageSizes: number[];

    public formSearch = '';
    public formStatus: FormStatus | 'all' = 'all';
    public formAccess: Access | 'all' = 'all';
    public formSort: FormSortField | 'title' = 'updated';
    public formSortOrder: Order = 'desc';

    public tasks: Array<Task>;
    public taskForms: Record<string, Form>;
    public taskOwners: Record<string, User>;
    public taskTotal: number;
    public taskPage = 1;
    public taskPerPage = 5;
    public taskPageSizes: number[];

    public taskStatus: TaskStatus | 'all' = 'all';
    public taskSort: TaskSortField | 'form.title' = 'updated';
    public taskSortOrder: Order = 'desc';
    public taskSortPath?: Array<string>;

    constructor(
        public titleService: Title,
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formAPI: FormAPIService
    ) {
        this.titleService.setTitle($localize`Dashboard - POWER.NI`);
    }

    ngOnInit() {
        this.updateForms(true);
        this.updateTasks(true);
        this.updateTags(true);
    }

    public async deleteForm(id: string) {
        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie dieses Formular wirklich löschen?`)) {
            return;
        }

        try {
            this.loadingscreen.setVisible(true);
            await this.formAPI.deleteForm(id);
            this.updateForms(false);
            this.updateTasks(false);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error.toString());
        }
    }

    public formCreated() {
        this.formSort = 'created';
        this.formSortOrder = 'desc';
        this.updateForms(false);
        if (this.formPagination) {
            this.formPagination.page = 1;
        }
    }

    /**
     * Imports form from JSON
     */
    /* istanbul ignore next */
    // tslint:disable-next-line: max-func-body-length
    public importForm() {
        const input = document.createElement('input');
        input.id = 'file-upload';
        input.type = 'file';
        input.accept = 'application/JSON';
        input.hidden = true;

        // Add the input element to the DOM so that it can be accessed from the tests
        const importButton = document.getElementById('button-import');
        importButton.parentNode.insertBefore(input, importButton);

        // File selected
        input.onchange = (event: Event) => {
            const file = event.target['files'][0];
            const reader = new FileReader();
            // Upload success
            reader.onload = () => {
                this.formAPI
                    .createForm({ fields: ['id'] }, reader.result.valueOf())
                    .then(() => {
                        this.updateForms(false);
                    })
                    .catch((error) => {
                        this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', error);
                    });
            };
            // FileReader is async -> call readAsText() after declaring the onload handler
            reader.readAsText(file);
        };
        input.click();
    }

    public changeFormSort(sort: FormSortField | 'title') {
        if (this.formSort === sort) {
            if (this.formSortOrder === 'asc') {
                this.formSortOrder = 'desc';
            } else {
                this.formSortOrder = 'asc';
            }
        } else {
            this.formSortOrder = 'asc';
        }
        this.formSort = sort;
        this.updateForms(false);
    }

    // tslint:disable-next-line: max-func-body-length
    public async updateForms(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetFormsParams = {
                fields: ['id', 'owner', 'tags', 'access', 'group', 'status', 'created', 'updated'],
                'owner-fields': ['id', 'name', 'given-name', 'family-name', 'groups'],
                extra: ['title.de', 'title.default'],
                limit: Number(this.formPerPage),
                offset: (this.formPage - 1) * this.formPerPage,
            };
            if (this.formSort === 'title') {
                params.sort = {
                    orderBy: { field: 'content', path: ['title', 'de'] },
                    alternative: { field: 'content', path: ['title', 'default'] },
                    order: this.formSortOrder,
                };
            } else {
                params.sort = { orderBy: { field: this.formSort }, order: this.formSortOrder };
            }
            const filters: Array<FormFilter> = [];
            if (this.formStatus !== 'all') {
                filters.push({ status: this.formStatus });
            }
            if (this.formAccess !== 'all') {
                filters.push({ access: this.formAccess });
            }
            if (this.formSearch !== '') {
                const or: Array<FormFilter> = [];
                const search = { lower: true, contains: this.formSearch };
                or.push({ content: { path: ['title', 'de'], text: search } });
                or.push({ content: { path: ['title', 'default'], text: search } });
                or.push({ tag: search });
                or.push({ 'has-owner-with': { name: search } });
                filters.push({ or: or });
            }
            if (filters.length > 0) {
                params.filter = { and: filters };
            } else if (filters.length === 1) {
                params.filter = filters[0];
            }
            const response = await this.formAPI.getForms(params);
            this.forms = response.forms;
            this.formOwners = response.owners;
            this.formTotal = response['total-forms'];
            let maxPages = Math.floor((this.formTotal - 1) / 5) + 1;
            if (maxPages > 10) {
                maxPages = 10;
                this.formPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            } else {
                this.formPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            }
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    public changeTaskSort(sort: TaskSortField | 'form.title') {
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
        this.updateTasks(false);
    }

    // tslint:disable-next-line: max-func-body-length
    public async updateTasks(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetTasksParams = {
                fields: ['id', 'form', 'pin', 'description', 'status', 'updated', 'created'],
                'form-fields': ['id', 'tags', 'owner', 'access', 'status', 'created', 'updated'],
                'owner-fields': ['all'],
                'form-extra': ['title.de', 'title.default'],
                limit: Number(this.taskPerPage),
                offset: (this.taskPage - 1) * this.taskPerPage,
            };

            if (this.taskStatus !== 'all') {
                params.filter = {
                    status: this.taskStatus,
                };
            }
            if (this.taskSort === 'form.title') {
                params.sort = {
                    orderBy: { field: 'form.content', path: ['title', 'de'] },
                    alternative: { field: 'form.content', path: ['title', 'default'] },
                    order: this.formSortOrder,
                };
            } else {
                params.sort = { orderBy: { field: this.taskSort }, order: this.taskSortOrder };
            }
            const response = await this.formAPI.getTasks(params);
            this.tasks = response.tasks;
            this.taskForms = response.forms;
            this.taskOwners = response.owners;
            this.taskTotal = response['total-tasks'];
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
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    public async updateTags(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            this.tags = await this.formAPI.getTags();
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
