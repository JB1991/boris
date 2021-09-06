import {
    Component, ViewChild, Input, Output, EventEmitter,
    ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-forms-editor-question-settings',
    templateUrl: './question-settings.component.html',
    styleUrls: ['./question-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionSettingsComponent {
    @ViewChild('questionsettingsmodal') public modal?: ModalComponent;

    @Input() public model: any;

    @Output() public modelChange = new EventEmitter<any>();

    public copy = '';

    public page?: number;

    public question?: number;

    public showDefault = false;

    constructor(public alerts: AlertsService,
        public storage: StorageService,
        public history: HistoryService,
        public cdr: ChangeDetectorRef) { }

    /**
     * Opens modal
     * @param question Question number
     * @param page Page number
     */
    public open(question: number, page: number): void {
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
        this.migration();
        this.cdr.detectChanges();
        if (this.modal) {
            this.modal.open($localize`Fragen Einstellungen`);
        }
    }

    /**
     * Modal close callback
     * @param value True if no invalid forms found
     */
    public close(value: boolean): void {
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
            this.page = undefined;
            this.question = undefined;
            this.storage.setAutoSaveEnabled(true);
        } else {
            // invalid input
            this.alerts.NewAlert('danger', $localize`Ungültige Einstellungen`, $localize`Bitte prüfen Sie Ihre Eingaben.`);
        }
    }

    /**
     * Switches title on or off
     */
    public toggleQuestionTitle(): void {
        if (!(this.page && this.question)) {
            return;
        }
        if (!this.model.pages[this.page].elements[this.question].titleLocation || this.model.pages[this.page].elements[this.question].titleLocation === 'default') {
            this.model.pages[this.page].elements[this.question].titleLocation = 'hidden';
        } else {
            this.model.pages[this.page].elements[this.question].titleLocation = 'default';
        }
    }

    /* istanbul ignore next */
    /**
     * Migrates element to newest version
     */
    private migration(): void { // eslint-disable-line complexity
        if (!(this.page && this.question)) {
            return;
        }

        // add commentText
        if (['radiogroup', 'checkbox', 'imageselector', 'rating', 'file', 'nouislider']
            .includes(this.model.pages[this.page].elements[this.question].type)) {
            if (!this.model.pages[this.page].elements[this.question].commentText) {
                this.model.pages[this.page].elements[this.question]['commentText'] = {};
            }
        }

        // add otherText
        if (['radiogroup', 'checkbox'].includes(this.model.pages[this.page].elements[this.question].type)) {
            if (!this.model.pages[this.page].elements[this.question].otherText) {
                this.model.pages[this.page].elements[this.question]['otherText'] = {};
            }
        }

        // add startWithNewLine
        if (typeof this.model.pages[this.page].elements[this.question].startWithNewLine === 'undefined') {
            this.model.pages[this.page].elements[this.question].startWithNewLine = true;
        }

        // RegEx validators
        if (typeof this.model.pages[this.page].elements[this.question].validators === 'object') {
            for (const validator of this.model.pages[this.page].elements[this.question].validators) {
                if (validator.type === 'regex' && typeof validator.text === 'string') {
                    validator.text = { default: validator.text };
                }
            }
        }
    }
}
