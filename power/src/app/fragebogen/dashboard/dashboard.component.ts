import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
    selector: 'power-forms-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(public titleService: Title,
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public storage: StorageService) {
        this.titleService.setTitle($localize`Dashboard - POWER.NI`);
        this.storage.resetService();
    }

    ngOnInit() {
        // load forms from server
        this.loadingscreen.setVisible(true);
        this.storage.loadFormsList().subscribe((data) => {
            // check for error
            if (!data || data['error'] || !data['data']) {
                const alertText = (data && data['error'] ? data['error'] : 'Forms');
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

                this.loadingscreen.setVisible(false);
                this.router.navigate(['/forms'], { replaceUrl: true });
                console.log('Could not load forms: ' + alertText);
                return;
            }

            // save data
            this.storage.formsList = data['data'];
            this.storage.formsCountTotal = this.storage.formsList.length;
            this.storage.formsList = this.storage.formsList.slice(0, this.storage.formsPerPage);

            // load tasks from server
            this.storage.loadTasksList().subscribe((data2) => {
                // check for error
                if (!data2 || data2['error'] || !data2['data']) {
                    const alertText = (data2 && data2['error'] ? data2['error'] : 'Tasks');
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

                    this.loadingscreen.setVisible(false);
                    this.router.navigate(['/forms'], { replaceUrl: true });
                    console.log('Could not load tasks: ' + alertText);
                    return;
                }

                // save data
                this.storage.tasksList = data2['data'];
                this.storage.tasksCountTotal = this.storage.tasksList.length;
                this.storage.tasksList = this.storage.tasksList.slice(0, this.storage.tasksPerPage);

                this.loadingscreen.setVisible(false);
            }, (error2: Error) => {
                // failed to load tags
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error2['statusText']);
                this.loadingscreen.setVisible(false);

                this.router.navigate(['/forms'], { replaceUrl: true });
                console.log(error2);
                return;
            });

            // load tags from server
            this.storage.loadTags().subscribe((data2) => {
                // check for error
                if (!data2 || data2['error'] || !data2['data']) {
                    const alertText = (data2 && data2['error'] ? data2['error'] : 'Tags');
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

                    this.router.navigate(['/forms'], { replaceUrl: true });
                    console.log('Could not load tags: ' + alertText);
                    return;
                }

                // save data
                this.storage.tagList = data2['data'];
            }, (error2: Error) => {
                // failed to load tags
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error2['statusText']);

                this.router.navigate(['/forms'], { replaceUrl: true });
                console.log(error2);
                return;
            });
        }, (error: Error) => {
            // failed to load forms
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms'], { replaceUrl: true });
            console.log(error);
            return;
        });
    }

    /**
     * Deletes an existing form from the Form-API
     * @param id Number of form
     */
    public deleteForm(id: number) {
        // check data
        if (id < 0 || id >= this.storage.formsList.length) {
            throw new Error('Invalid id');
        }
        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie dieses Formular wirklich löschen?`)) {
            return;
        }

        this.storage.deleteForm(this.storage.formsList[id].id).subscribe((data) => {
            // check for error
            if (!data || data['error']) {
                const alertText = (data && data['error'] ? data['error'] : this.storage.formsList[id].id);
                this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, alertText);
                console.log('Could not delete form: ' + alertText);
                return;
            }

            // Success
            this.storage.formsList.splice(id, 1);
            this.alerts.NewAlert('success', $localize`Formular gelöscht`,
                $localize`Das Formular wurde erfolgreich gelöscht.`);
        }, (error: Error) => {
            // failed to delete form
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error['statusText']);
            console.log(error);
            return;
        });
    }

    /**
     * Triggered by the pagination event, when the user changes the page
     * @param event Contains the page number and the number of items per page
     */
    public formsPageChanged(event: PageChangedEvent): void {
        const limit = event.itemsPerPage;
        const offset = (event.page - 1) * event.itemsPerPage;
        this.loadFormsFromAPI(limit, offset);
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
     * Load the list of forms from the Form-API
     * @param limit The maximum number of forms to be loaded
     * @param offset The number of the first form to be loaded
     */
    private loadFormsFromAPI(limit?: number, offset?: number) {
        this.storage.loadFormsList(limit, offset).subscribe((data) => {
            // check for error
            if (!data || data['error'] || !data['data']) {
                const alertText = (data && data['error'] ? data['error'] : 'Forms');
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);
                this.loadingscreen.setVisible(false);
                this.router.navigate(['/forms'], { replaceUrl: true });
                console.log('Could not load forms: ' + alertText);
                return;
            }

            // save data
            this.storage.formsList = data['data'];
            this.loadingscreen.setVisible(false);
        }, (error: Error) => {
            // failed to load forms
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
            this.loadingscreen.setVisible(false);
            this.router.navigate(['/forms'], { replaceUrl: true });
            console.log(error);
            return;
        });
    }

    /**
     * Load the list of tasks from the Form-API
     * @param limit The maximum number of forms to be loaded
     * @param offset The number of the first form to be loaded
     */
    private loadTasksFromAPI(limit?: number, offset?: number) {
        this.storage.loadTasksList(limit, offset).subscribe((data) => {
            // check for error
            if (!data || data['error'] || !data['data']) {
                const alertText = (data && data['error'] ? data['error'] : 'Tasks');
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

                this.loadingscreen.setVisible(false);
                this.router.navigate(['/forms'], { replaceUrl: true });
                console.log('Could not load tasks: ' + alertText);
                return;
            }

            // save data
            this.storage.tasksList = data['data'];
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
