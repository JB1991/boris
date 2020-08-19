import { Component, Input, ViewChild } from '@angular/core';
import { environment } from '@env/environment';

import { WrapperComponent } from '../wrapper.component';
import { Bootstrap4_CSS } from '../style';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-forms-surveyjs-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})
export class PreviewComponent {
    @ViewChild('previewmodal') public modal: ModalComponent;
    @ViewChild('wrapper') public wrapper: WrapperComponent;
    @Input() public form: any;
    @Input() public data: any = null;
    public surveyjs_style = Bootstrap4_CSS;
    public mode = 'edit';
    public language = 'de';
    public showInvisible = false;
    public isVisible = false;

    constructor() { }

    /**
     * Opens full formular preview
     * @param mode Survey mode [edit, display]
     * @param data Survey data
     */
    public open(mode?: string, data?: any) {
        // set mode
        if (mode) {
            if (!(mode === 'edit' || mode === 'display')) {
                throw new Error('mode is invalid');
            }
            this.mode = mode;
            this.showInvisible = false;
            this.language = 'de';
        }
        // set data to display
        if (data && !this.data) {
            this.data = data;
        }

        // show modal
        this.isVisible = true;
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
