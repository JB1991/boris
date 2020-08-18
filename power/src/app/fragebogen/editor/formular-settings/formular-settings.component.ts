import { Component, OnInit, ViewChild } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-forms-editor-formular-settings',
    templateUrl: './formular-settings.component.html',
    styleUrls: ['./formular-settings.component.scss']
})
export class FormularSettingsComponent implements OnInit {
    @ViewChild('formsettingsmodal') public modal: ModalComponent;
    public copy = '';

    constructor(public alerts: AlertsService,
        public storage: StorageService,
        public history: HistoryService) { }

    ngOnInit(): void {
    }

    /**
     * Opens modal
     */
    public open() {
        this.copy = JSON.stringify(this.storage.model);
        this.storage.setAutoSaveEnabled(false);
        this.modal.open($localize`Formular Einstellungen`);
    }

    /**
     * Modal close callback
     */
    public close() {
        // changed something
        if (this.copy && this.copy !== JSON.stringify(this.storage.model)) {
            this.history.makeHistory(JSON.parse(this.copy));
            this.storage.setUnsavedChanges(true);
        }
        this.copy = '';
        this.storage.setAutoSaveEnabled(true);
    }

    /**
     * Moves page up
     * @param i Page number
     */
    public moveUp(i: number) {
        // check data
        if (i < 0 || i >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        // check if page can move up
        if (i === 0) {
            return;
        }

        // move up
        moveItemInArray(this.storage.model.pages, i, i - 1);
    }

    /**
     * Moves page down
     * @param i Page number
     */
    public moveDown(i: number) {
        // check data
        if (i < 0 || i >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        // check if page can move down
        if (i === this.storage.model.pages.length - 1) {
            return;
        }

        // move down
        moveItemInArray(this.storage.model.pages, i, i + 1);
    }
}
