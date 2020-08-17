import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { environment } from '@env/environment';

import { ModalComponent } from '@app/shared/modal/modal.component';
import { Bootstrap4_CSS } from '../style';

@Component({
    selector: 'power-forms-surveyjs-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
    @ViewChild('previewmodal') public modal: ModalComponent;
    @Input() public form: any;
    @Input() public data: any = null;
    public surveyjs_style = Bootstrap4_CSS;
    public mode = 'edit';

    constructor() {
    }

    ngOnInit() {
    }

    /**
     * Opens full formular preview
     * @param mode Survey mode [edit, display]
     * @param data Survey data
     */
    public open(mode = 'edit', data?: any) {
        if (!(mode === 'edit' || mode === 'display')) {
            throw new Error('mode is invalid');
        }
        if (data && !this.data) {
            this.data = data;
        }

        this.mode = mode;
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
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
