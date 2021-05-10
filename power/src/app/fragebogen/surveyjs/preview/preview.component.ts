import { Component, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { environment } from '@env/environment';
import { surveyLocalization } from 'survey-angular';

import { WrapperComponent } from '../wrapper.component';
import { Bootstrap4_CSS } from '../style';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-forms-surveyjs-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent {
    @ViewChild('previewmodal') public modal: ModalComponent;
    @ViewChild('wrapper') public wrapper: WrapperComponent;
    @Input() public form: any;
    @Input() public data: any = null;
    public surveyjs_style = Bootstrap4_CSS;
    public mode = 'display';
    public language = 'de';
    public showInvisible = false;
    public isVisible = false;
    public languages = surveyLocalization.localeNames;

    constructor(public cdr: ChangeDetectorRef) { }

    /**
     * Opens full formular preview
     * @param mode Survey mode [edit, display]
     * @param data Survey data
     */
    public open(mode?: 'edit' | 'display', data?: any) {
        // set mode
        if (mode) {
            this.mode = mode;
            this.showInvisible = false;
        }
        // set data to display
        if (data && !this.data) {
            this.data = data;
        }

        // show modal
        this.language = this.form.locale;
        this.isVisible = true;
        this.cdr.detectChanges();
        if (this.data) {
            this.modal.open($localize`Ergebnisvorschau`);
        } else {
            this.modal.open($localize`Formularvorschau`);
        }
    }

    /**
     * Closes full formular preview
     */
    public close() {
        this.data = null;
        this.isVisible = false;
        this.cdr.detectChanges();
    }

    /**
     * Debug prints result in console
     * @param data Data
     */
    public debugPrint(data: any) {
        if (!environment.production) {
            console.log(data);
        }
    }

    /**
     * Set language
     */
    public setLanguage() {
        this.wrapper.survey.locale = this.language;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
