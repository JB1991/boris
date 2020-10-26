import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import * as Survey from 'survey-angular';

import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-forms-editor-formular-settings',
    templateUrl: './formular-settings.component.html',
    styleUrls: ['./formular-settings.component.scss']
})
export class FormularSettingsComponent {
    @ViewChild('formsettingsmodal') public modal: ModalComponent;
    @Input() public model: any;
    @Output() public modelChange = new EventEmitter<any>();
    public copy = '';
    public languages = Survey.surveyLocalization.localeNames;

    constructor(public alerts: AlertsService,
        public storage: StorageService,
        public history: HistoryService) { }

    /**
     * Opens modal
     */
    public open() {
        this.copy = JSON.stringify(this.model);
        this.storage.setAutoSaveEnabled(false);
        this.modal.open($localize`Formular Einstellungen`);
    }

    /**
     * Modal close callback
     * @param value True if no invalid forms found
     */
    public close(value: boolean) {
        if (value) {
            // changed something
            if (this.copy && this.copy !== JSON.stringify(this.model)) {
                this.alerts.NewAlert('success', $localize`Änderungen übernommen`,
                    $localize`Ihre Änderungen wurden erfolgreich zwischen gespeichert.`);
                this.history.makeHistory(JSON.parse(this.copy));
                this.storage.setUnsavedChanges(true);
                this.modelChange.emit(JSON.parse(JSON.stringify(this.model)));
            }
            this.copy = '';
            this.storage.setAutoSaveEnabled(true);
        } else {
            // invalid input
            this.alerts.NewAlert('danger', $localize`Ungültige Einstellungen`, $localize`Bitte prüfen Sie Ihre Eingaben.`);
        }
    }

    /**
     * Moves page up
     * @param i Page number
     */
    public moveUp(i: number) {
        // check data
        if (i < 0 || i >= this.model.pages.length) {
            throw new Error('page is invalid');
        }
        // check if page can move up
        if (i === 0) {
            return;
        }

        // move up
        moveItemInArray(this.model.pages, i, i - 1);
    }

    /**
     * Moves page down
     * @param i Page number
     */
    public moveDown(i: number) {
        // check data
        if (i < 0 || i >= this.model.pages.length) {
            throw new Error('page is invalid');
        }
        // check if page can move down
        if (i === this.model.pages.length - 1) {
            return;
        }

        // move down
        moveItemInArray(this.model.pages, i, i + 1);
    }

    /**
     * Open page tab
     */
    /* istanbul ignore next */
    public openPage() {
        (<any>document.activeElement).click();
    }
}
