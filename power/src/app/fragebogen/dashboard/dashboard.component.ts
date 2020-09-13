import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService } from '../formapi.service';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'power-forms-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
    public formTotal: number;
    public formPage = 1;
    public formPerPage = 5;
    public formPageSizes: number[];

    public formTitle?: string;
    public formStatus?: 'created' | 'published' | 'cancelled' | 'all';
    public formAccess?: 'public' | 'pin6' | 'pin8' | 'pin6-factor' | 'all';
    public formSort: 'id' | 'title' | 'created' | 'published' | 'cancelled' = 'title';
    public formOrder: 'asc' | 'desc' = 'asc';

    public taskTotal: number;
    public taskPage = 1;
    public taskPerPage = 5;
    public taskPageSizes: number[];

    public taskStatus?: 'created' | 'accessed' | 'submitted' | 'all';
    public taskSort: 'id' | 'form-id' | 'factor' | 'pin' | 'created' | 'submitted' = 'submitted';
    public taskOrder: 'asc' | 'desc' = 'desc';

    constructor(public titleService: Title,
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public formAPI: FormAPIService,
        public data: DataService) {
        this.titleService.setTitle($localize`Dashboard - POWER.NI`);
    }

    ngOnInit() {
        this.updateForms(true);
        this.updateTasks(true);
        this.updateTags(true);
    }

    public async deleteForm(id: string) {
        try {
            this.loadingscreen.setVisible(true);
            const response = await this.formAPI.deleteInternForm(id);
            this.updateForms(false);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error.toString());
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
            /* istanbul ignore next */
            reader.onload = () => {
                this.formAPI.createInternForm(reader.result).then(() => {
                    this.updateForms(false);
                }).catch((error) => {
                    this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', error);
                });
            };
            // FileReader is async -> call readAsText() after declaring the onload handler
            reader.readAsText(file);
        };
        input.click();
    }

    public changeFormSort(sort: 'id' | 'title' | 'created' | 'published' | 'cancelled') {
        if (this.formSort === sort) {
            if (this.formOrder === 'asc') {
                this.formOrder = 'desc';
            } else {
                this.formOrder = 'asc';
            }
        } else {
            this.formOrder = 'asc';
        }
        this.formSort = sort;
        this.updateForms(false);
    }

    public async updateForms(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params = {
                limit: this.formPerPage,
                offset: (this.formPage - 1) * this.formPerPage,
                sort: this.formSort,
                order: this.formOrder,
            };
            if (this.formStatus !== undefined && this.formStatus !== 'all') {
                params['status'] = this.formStatus;
            }
            if (this.formAccess !== undefined && this.formAccess !== 'all') {
                params['access'] = this.formAccess;
            }
            if (this.formTitle !== undefined) {
                params['title-contains'] = this.formTitle;
            }
            const response = await this.formAPI.getInternForms(params);
            this.data.forms = response.data;
            this.formTotal = response.total;
            const maxPages = Math.floor(this.formTotal / 5) + 1;
            this.formPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            if (navigate) {
                this.router.navigate(['/forms'], { replaceUrl: true });
            }
        }
    }

    public changeTaskSort(sort: 'id' | 'form-id' | 'factor' | 'pin' | 'created' | 'submitted') {
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

    public async updateTasks(navigate: boolean) {
        try {
            this.loadingscreen.setVisible(true);
            const params = {
                limit: this.taskPerPage,
                offset: (this.taskPage - 1) * this.taskPerPage,
                sort: this.taskSort,
                order: this.taskOrder,
            };
            if (this.taskStatus !== undefined && this.taskStatus !== 'all') {
                params['status'] = this.taskStatus;
            }
            const response = await this.formAPI.getInternTasks(params);
            this.data.tasks = response.data;
            this.taskTotal = response.total;
            const maxPages = Math.floor(this.taskTotal / 5) + 1;
            this.taskPageSizes = Array.from(Array(maxPages), (_, i) => (i + 1) * 5);
            this.loadingscreen.setVisible(false);
        } catch (error) {
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
            this.data.tags = await this.formAPI.getInternTags();
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
