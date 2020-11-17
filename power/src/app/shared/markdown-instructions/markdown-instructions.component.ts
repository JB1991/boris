import { Component, OnInit, ViewChild,
    ChangeDetectorRef } from '@angular/core';

import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
    selector: 'power-markdown-instructions',
    templateUrl: './markdown-instructions.component.html',
    styleUrls: ['./markdown-instructions.component.scss']
})
export class MarkdownInstructionsComponent implements OnInit {
    @ViewChild('formattinghelpmodal') public modal: ModalComponent;

    constructor(public cdr: ChangeDetectorRef) { }

    ngOnInit() {
    }

    /**
     * Opens modal
     */
    public open() {
        this.modal.open($localize`Formatierungshilfe`);
    }

    public close() {

    }

}
