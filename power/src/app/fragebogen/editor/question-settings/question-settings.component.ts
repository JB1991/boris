import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

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
    @Input() public model: any;
    @Output() public modelChange = new EventEmitter<any>();
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
        if (page < 0 || page >= this.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (question < 0 || question >= this.model.pages[page].elements.length) {
            throw new Error('question is invalid');
        }

        this.page = page;
        this.question = question;
        this.copy = JSON.stringify(this.model);
        this.storage.setAutoSaveEnabled(false);
        this.modal.open($localize`Fragen Einstellungen`);
        this.migration();
    }

    /**
     * Modal close callback
     */
    public close() {
        // changed something
        if (this.copy && this.copy !== JSON.stringify(this.model)) {
            this.history.makeHistory(JSON.parse(this.copy));
            this.storage.setUnsavedChanges(true);
            this.modelChange.emit(JSON.parse(JSON.stringify(this.model)));
        }
        this.page = null;
        this.question = null;
        this.copy = '';
        this.storage.setAutoSaveEnabled(true);
    }

    /**
     * Migrates element to newest version
     */
    /* istanbul ignore next */
    private migration() {
        // add commentText
        if (['radiogroup', 'checkbox', 'imagepicker', 'rating', 'file', 'nouislider']
            .includes(this.model.pages[this.page].elements[this.question].type)) {
            if (!this.model.pages[this.page].elements[this.question].commentText) {
                this.model.pages[this.page].elements[this.question]['commentText'] = {};
            }
        }
    }
}
