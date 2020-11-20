import { Component, ViewChild } from '@angular/core';

import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

@Component({
    selector: 'power-markdown-instructions',
    templateUrl: './markdown-instructions.component.html',
    styleUrls: ['./markdown-instructions.component.scss']
})
export class MarkdownInstructionsComponent {
    @ViewChild('formattinghelpmodal') public modal: ModalminiComponent;

    constructor() { }

    public open() {
        this.modal.open($localize`Formatierungshilfe`);
    }
}
