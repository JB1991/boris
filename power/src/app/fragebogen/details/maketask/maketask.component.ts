import { Component, ViewChild, EventEmitter, Output } from '@angular/core';

import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

@Component({
    selector: 'power-forms-details-maketask',
    templateUrl: './maketask.component.html',
    styleUrls: ['./maketask.component.scss']
})
export class MaketaskComponent {
    @Output() out = new EventEmitter<{
        amount: number;
        copyvalue: boolean;
    }>();

    @ViewChild('maketaskmodal') public modal?: ModalminiComponent;
    public amount = 1;
    public pinList = [];
    public copy = false;

    /**
     * Opens make task modal
     */
    public open(): void {
        this.amount = 1;
        this.pinList = [];
        this.modal?.open($localize`PINs erstellen`);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
