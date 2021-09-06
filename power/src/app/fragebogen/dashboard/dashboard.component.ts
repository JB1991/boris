import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService, GetFormsParams, GetTasksParams } from '../formapi.service';
import { FormStatus, Access, TaskStatus, FormFilter, Task, Form, FormField, TaskField } from '../formapi.model';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-forms-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
    public tags = new Array<string>();

    public forms = new Array<Form>();
    public formTotal = 0;
    public formPage = 1;
    public formPerPage = 5;
    public formPageSizes = new Array<number>();

    public formSearch = '';
    public formStatus: FormStatus | 'all' = 'all';
    public formAccess: Access | 'all' = 'all';
    public formSort: FormField = 'updated';
    public formSortDesc = true;

    public tasks = new Array<Task>();
    public taskTotal = 0;
    public taskPage = 1;
    public taskPerPage = 5;
    public taskPageSizes = new Array<number>();

    public taskStatus: TaskStatus | 'all' = 'all';
    public taskSort: TaskField = 'updated';
    public taskSortDesc = true;

    constructor(
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formAPI: FormAPIService,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Dashboard - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Ausfüllen von online Formularen und Anträgen` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Formulare, Anträge` });
    }

    /** @inheritdoc */
    public ngOnInit(): void {
        void this.updateForms(true);
        void this.updateTasks(true);
        void this.updateTags(true);
    }

    /**
     * deleteForm
     * @param id id
     */
    public async deleteForm(id: string): Promise<void> {
        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie dieses Formular wirklich löschen?`)) {
            return;
        }

        try {
            this.loadingscreen.setVisible(true);
            await this.formAPI.deleteForm(id);
            void this.updateForms(false);
            void this.updateTasks(false);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, this.formAPI.getErrorMessage(error));
        }
    }

    /* istanbul ignore next */
    /**
     * Imports form from JSON
     */
    public importForm(): void {
        const input = document.createElement('input');
        input.id = 'file-upload';
        input.type = 'file';
        input.accept = 'application/JSON';
        input.hidden = true;

        // Add the input element to the DOM so that it can be accessed from the tests
        const importButton = document.getElementById('button-import');
        importButton?.parentNode?.insertBefore(input, importButton);

        // File selected
        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (!target || !target.files) {
                return;
            }
            const file = target.files[0];
            const reader = new FileReader();
            // Upload success
            reader.onload = () => {
                try {
                    this.formAPI.createForm({
                        content: JSON.parse(reader?.result ? reader.result.toString() : '{"error": "no result"}')
                    }).then(() => {
                        this.formSortDesc = true;
                        this.formSort = 'created';
                        void this.updateForms(false);
                        this.alerts.NewAlert('success', $localize`Import erfolgreich`, $localize`Der Fragebogen wurde erfolgreich importiert.`);
                    }).catch((error) => {
                        console.error(error);
                        this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, this.formAPI.getErrorMessage(error));
                    });
                } catch (e) {
                    console.error(e);
                    this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, $localize`Das Dokument ist kein gültiges Formular.`);
                }
            };
            // FileReader is async -> call readAsText() after declaring the onload handler
            reader.readAsText(file);
        };
        input.click();
    }

    /**
     * updateForms
     * @param navigate check if route should change to dashboard on failure
     */
    public async updateForms(navigate: boolean): Promise<void> {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetFormsParams = {
                fields: ['id', 'owner.name', 'extract', 'access', 'status', 'created', 'updated', 'tags', 'groups'],
                extract: ['title.de', 'title.default'],
                limit: Number(this.formPerPage),
                offset: (this.formPage - 1) * this.formPerPage
            };
            params.sort = { desc: this.formSortDesc, field: this.formSort };
            const filters = new Array<FormFilter>();
            if (this.formStatus !== 'all') {
                filters.push({ status: this.formStatus });
            }
            if (this.formAccess !== 'all') {
                filters.push({ access: this.formAccess });
            }
            if (this.formSearch !== '') {
                const or = new Array<FormFilter>();
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
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formAPI.getErrorMessage(error));
            if (navigate) {
                void this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    /**
     * updateTasks
     * @param navigate check if route should change to dashboard on failure
     */
    public async updateTasks(navigate: boolean): Promise<void> {
        try {
            this.loadingscreen.setVisible(true);
            const params: GetTasksParams = {
                fields: ['id', 'form.id', 'form.extract', 'pin', 'description', 'status', 'updated', 'created'],
                'form.extract': ['title.de', 'title.default'],
                limit: Number(this.taskPerPage),
                offset: (this.taskPage - 1) * this.taskPerPage
            };

            if (this.taskStatus !== 'all') {
                params.filter = {
                    status: this.taskStatus
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
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formAPI.getErrorMessage(error));
            if (navigate) {
                void this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    /**
     * updateTags
     * @param navigate check if route should change to dashboard on failure
     * @returns empty promise
     */
    public async updateTags(navigate: boolean): Promise<void> {
        try {
            this.loadingscreen.setVisible(true);
            const response = await this.formAPI.getTags({});
            this.tags = response.tags;
            this.loadingscreen.setVisible(false);
        } catch (error) {
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formAPI.getErrorMessage(error));
            if (navigate) {
                void this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    /**
     * changeFormSort
     * @param sort by form field
     */
    public changeFormSort(sort: FormField): void {
        if (this.formSort === sort) {
            this.formSortDesc = !this.formSortDesc;
        } else {
            this.formSortDesc = false;
        }
        this.formSort = sort;
        void this.updateForms(false);
    }

    /**
     * changeTaskSort
     * @param sort by task field
     */
    public changeTaskSort(sort: TaskField): void {
        if (this.taskSort === sort) {
            this.taskSortDesc = !this.taskSortDesc;
        } else {
            this.taskSortDesc = false;
        }
        this.taskSort = sort;
        void this.updateTasks(false);
    }

    /**
     * Returns value of change event
     * @param event Change Event
     * @returns Value
     */
    public getHTMLInputValue(event: Event): any {
        return (event.target as HTMLInputElement).value;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
