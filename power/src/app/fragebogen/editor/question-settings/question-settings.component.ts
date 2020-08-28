import { Component, ViewChild } from '@angular/core';

import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-forms-editor-question-settings',
    templateUrl: './question-settings.component.html',
    styleUrls: ['./question-settings.component.scss']
})
export class QuestionSettingsComponent {
    @ViewChild('questionsettingsmodal') public modal: ModalComponent;
    public copy = '';
    public page: number = null;
    public question: number = null;
    public showDefault = false;

    constructor(public alerts: AlertsService,
        public storage: StorageService,
        public history: HistoryService) { }

    /**
     * Opens modal
     */
    public open(question: number, page: number) {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (question < 0 || question >= this.storage.model.pages[page].elements.length) {
            throw new Error('question is invalid');
        }

        this.page = page;
        this.question = question;
        this.copy = JSON.stringify(this.storage.model);
        this.storage.setAutoSaveEnabled(false);
        this.modal.open($localize`Fragen Einstellungen`);
    }

    /**
     * Modal close callback
     */
    public close() {
        // changed something
        if (this.copy && this.copy !== JSON.stringify(this.storage.model)) {
            this.history.makeHistory(JSON.parse(this.copy));
            this.storage.setUnsavedChanges(true);

            // hack to force update workspace
            this.storage.model = JSON.parse(JSON.stringify(this.storage.model));
        }
        this.page = null;
        this.question = null;
        this.copy = '';
        this.storage.setAutoSaveEnabled(true);
    }
}
