import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Bootstrap4_CSS } from '../style';
import { environment } from '@env/environment';

@Component({
    selector: 'power-formulars-surveyjs-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnDestroy {
    @Input() public form: any;
    @Input() public data: any = null;
    public isOpen = false;
    public surveyjs_style = Bootstrap4_CSS;
    public mode = 'edit';

    constructor() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        document.body.classList.remove('overflow-hidden');
    }

    /**
     * Opens full formular preview
     * @param mode Survey mode [edit, display]
     * @param data Survey data
     */
    public Open(mode = 'edit', data?: any) {
        if (!(mode === 'edit' || mode === 'display')) {
            throw new Error('mode is invalid');
        }
        if (data && !this.data) {
            this.data = data;
        }

        document.body.classList.add('overflow-hidden');
        this.mode = mode;
        this.isOpen = true;
    }

    /**
     * Closes full formular preview
     */
    public Close() {
        document.body.classList.remove('overflow-hidden');
        this.isOpen = false;
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
