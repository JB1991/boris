import { Component, ViewChild } from '@angular/core';

import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-markdown-instructions',
    templateUrl: './markdown-instructions.component.html',
    styleUrls: ['./markdown-instructions.component.scss']
})
export class MarkdownInstructionsComponent {
    @ViewChild('formattinghelpmodal') public modal: ModalComponent;

    constructor() { }

    /**
     * Opens modal
     */
    public open() {
        this.modal.open($localize`Formatierungshilfe`);
    }

    public close() {

    }

}
