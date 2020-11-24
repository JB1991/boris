import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService, GetFormsParams, GetTasksParams } from '../formapi.service';
import { FormStatus, Access, TaskStatus, FormFilter, Task, Form, FormField, TaskField } from '../formapi.model';
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
    public formTotal: number;
    public formPage = 1;
    public formPerPage = 5;
    public formPageSizes: number[];

    public formSearch = '';
    public formStatus: FormStatus | 'all' = 'all';
    public formAccess: Access | 'all' = 'all';
    public formSort: FormField = 'updated';
    public formSortDesc = true;

    public tasks: Array<Task>;
    public taskTotal: number;
    public taskPage = 1;
    public taskPerPage = 5;
    public taskPageSizes: number[];

    public taskStatus: TaskStatus | 'all' = 'all';
    public taskSort: TaskField = 'updated';
    public taskSortDesc = true;

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
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
        }
    }

    /**
     * Imports form from JSON
     */
    /* istanbul ignore next */
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
                    .createForm({
                        content: JSON.parse(reader.result.toString()),
                    })
                    .then(() => {
                        this.updateForms(false);
                    })
                    .catch((error) => {
                        this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', error.error && error.error['message'] ? error.error['message'] : error.error.toString() );
                    });
            };
            // FileReader is async -> call readAsText() after declaring the onload handler
            reader.readAsText(file);
        };
        input.click();
    }

    public async updateForms(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetFormsParams = {
                fields: ['id', 'owner.name', 'extract', 'access', 'status', 'created', 'updated', 'tags', 'groups'],
                extract: ['title.de', 'title.default'],
                limit: Number(this.formPerPage),
                offset: (this.formPage - 1) * this.formPerPage,
            };
            params.sort = { desc: this.formSortDesc, field: this.formSort };
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
                or.push({ extract: search });
                or.push({ tag: search });
                or.push({ owner: { name: search } });
                filters.push({ or: or });
            }
            if (filters.length > 0) {
                params.filter = { and: filters };
            }
            const response = await this.formAPI.getForms(params);
            this.forms = response.forms;
            this.formTotal = response.total;
            let maxPages = Math.floor((this.formTotal - 1) / 5) + 1;
            if (maxPages > 10) {
                maxPages = 10;
            }
            this.formPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    public async updateTasks(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetTasksParams = {
                fields: ['id', 'form.id', 'form.extract', 'pin', 'description', 'status', 'updated', 'created'],
                'form.extract': ['title.de', 'title.default'],
                limit: Number(this.taskPerPage),
                offset: (this.taskPage - 1) * this.taskPerPage,
            };

            if (this.taskStatus !== 'all') {
                params.filter = {
                    status: this.taskStatus,
                };
            }
            params.sort = { field: this.taskSort, desc: this.taskSortDesc };
            const response = await this.formAPI.getTasks(params);
            this.tasks = response.tasks;
            this.taskTotal = response.total;
            let maxPages = Math.floor((this.taskTotal - 1) / 5) + 1;
            if (maxPages > 10) {
                maxPages = 10;
            }
            this.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    public async updateTags(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const response = await this.formAPI.getTags({});
            this.tags = response.tags;
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.log(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`,
                (error['error'] && error['error']['message'] ? error['error']['message'] : error.toString()));
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    public changeFormSort(sort: FormField) {
        if (this.formSort === sort) {
            this.formSortDesc = !this.formSortDesc;
        } else {
            this.formSortDesc = false;
        }
        this.formSort = sort;
        this.updateForms(false);
    }

    public changeTaskSort(sort: TaskField) {
        if (this.taskSort === sort) {
            this.taskSortDesc = !this.taskSortDesc;
        } else {
            this.taskSortDesc = false;
        }
        this.taskSort = sort;
        this.updateTasks(false);
    }

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
