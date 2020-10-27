import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Form, Task } from '@app/fragebogen/formapi.model';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { FormAPIService } from '../../formapi.service';

@Component({
    selector: 'power-forms-details-maketask',
    templateUrl: './maketask.component.html',
    styleUrls: ['./maketask.component.css']
})
export class MaketaskComponent {
    @Input() public form: Form;
    @Input() public tasks: Array<Task> = [];
    @Input() public taskTotal = 0;
    @Input() public taskPerPage = 5;
    @Input() public taskPageSizes: Array<number> = [];

    @ViewChild('maketaskmodal') public modal: ModalminiComponent;
    public amount = 1;
    public pinList = [];
    public copy = false;

    constructor(public alerts: AlertsService,
        public formapi: FormAPIService) {
    }

    /**
     * Opens make task modal
     */
    public open() {
        this.amount = 1;
        this.pinList = [];
        this.modal.open($localize`PINs erstellen`);
    }

    /**
     * Closes make task modal
     */
    public close() {
        this.modal.close();
    }

    /**
     * Generates PINs
     */
    // tslint:disable-next-line: max-func-body-length
    public async Generate() {
        // check amount bounds
        if (this.amount < 1 || this.amount > 100) {
            this.alerts.NewAlert('danger', $localize`Ungültige Eingabe`,
                $localize`Bitte generieren Sie nur zwischen 1 und 100 PINs.`);
            throw new Error('Invalid bounds for variable amount');
        }

        for (let i = 0; i++; i < this.amount) {
            try {
                const createResult = await this.formapi.createTask(this.form.id, {});
                const findResult = await this.formapi.getTask(createResult.id, { fields: ['all'] });
                this.taskTotal++;
                this.pinList.push(findResult.task.pin);
                if (this.tasks.length < this.taskPerPage) {
                    this.tasks.push(findResult.task);
                }
                let maxPages = Math.floor(this.taskTotal / 5) + 1;
                if (maxPages > 10) {
                    maxPages = 10;
                    this.taskPageSizes = Array.from(Array(maxPages), (_, j) => (j + 1) * 5);
                } else {
                    this.taskPageSizes = Array.from(Array(maxPages), (_, j) => (j + 1) * 5);
                }

            } catch (error) {
                // failed to create task
                this.alerts.NewAlert('danger', $localize`Erstellen fehlgeschlagen`, error.toString());
                console.log(error);
                return;
            }
        }

        // copy to clipboard
        if (this.copy) {
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = this.pinList.join('\n');
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }

        // close modal
        this.close();
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
