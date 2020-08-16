import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { StorageService } from './storage.service';
import { PreviewComponent } from '@app/fragebogen/surveyjs/preview/preview.component';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

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
        public storage: StorageService) {
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
    public loadData(id: string) {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        // load form form server
        this.storage.loadForm(id).subscribe((data) => {
            // check for error
            if (!data || data['error'] || !data['data']) {
                const alertText = (data && data['error'] ? data['error'] : id);
                this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

                this.loadingscreen.setVisible(false);
                this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
                console.log('Could not load form: ' + alertText);
                return;
            }

            // save data
            this.storage.form = data['data'];

            if (this.storage.form.status !== 'created') {
                // load tasks from server
                this.storage.loadTasks(this.storage.form.id).subscribe((data2) => {
                    // check for error
                    if (!data2 || data2['error'] || !data2['data']) {
                        const alertText = (data2 && data2['error'] ? data2['error'] : this.storage.form.id);
                        this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

                        this.loadingscreen.setVisible(false);
                        this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
                        console.log('Could not load task: ' + alertText);
                        return;
                    }

                    // save data
                    this.storage.tasksList = data2['data'];
                    this.loadingscreen.setVisible(false);
                }, (error2: Error) => {
                    // failed to load task list
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error2['statusText']);
                    this.loadingscreen.setVisible(false);

                    this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
                    console.log(error2);
                    return;
                });
            } else {
                this.loadingscreen.setVisible(false);
            }
        }, (error: Error) => {
            // failed to load form
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            console.log(error);
            return;
        });
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
        this.storage.deleteForm(this.storage.form.id).subscribe((data) => {
            // check for error
            if (!data || data['error']) {
                const alertText = (data && data['error'] ? data['error'] : this.storage.form.id);
                this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, alertText);

                console.log('Could not delete form: ' + alertText);
                return;
            }

            // success
            this.alerts.NewAlert('success', $localize`Formular gelöscht`,
                $localize`Das Formular wurde erfolgreich gelöscht.`);
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }, (error: Error) => {
            // failed to delete form
            this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, error['statusText']);
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

        // archive form
        this.storage.archiveForm(this.storage.form.id).subscribe((data) => {
            // check for error
            if (!data || data['error']) {
                const alertText = (data && data['error'] ? data['error'] : this.storage.form.id);
                this.alerts.NewAlert('danger', $localize`Archivieren fehlgeschlagen`, alertText);

                console.log('Could not archive form: ' + alertText);
                return;
            }

            // success
            this.storage.form = data['data'];
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
        this.storage.getCSV(this.storage.form.id).subscribe((data) => {
            // check for error
            if (!data) {
                this.alerts.NewAlert('danger', $localize`Download fehlgeschlagen`,
                    $localize`Die Antworten konnten nicht geladen werden.`);

                console.log('Could not load results: ' + this.storage.form.id);
                return;
            }

            // download csv
            const blob = new Blob([data.toString()], { type: 'text/csv;charset=utf-8;' });
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
        if (i < 0 || i >= this.storage.tasksList.length) {
            throw new Error('invalid i');
        }

        // Ask user to confirm deletion
        if (!confirm($localize`Möchten Sie diese Antwort wirklich löschen?`)) {
            return;
        }

        // delete task
        this.storage.deleteTask(this.storage.tasksList[i].id).subscribe((data) => {
            // check for error
            if (!data || data['error']) {
                const alertText = (data && data['error'] ? data['error'] : this.storage.tasksList[i].id);
                this.alerts.NewAlert('danger', $localize`Löschen fehlgeschlagen`, alertText);

                console.log('Could not delete task: ' + alertText);
                return;
            }

            // success
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
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
