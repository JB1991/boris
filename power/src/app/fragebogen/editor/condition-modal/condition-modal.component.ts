import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';

@Component({
    selector: 'power-forms-editor-condition-modal',
    templateUrl: './condition-modal.component.html',
    styleUrls: ['./condition-modal.component.scss']
})
export class ConditionModalComponent {
    @ViewChild('conditionmodal') public modal: ModalminiComponent;
    @Input() public model: any;
    @Input() public data: any;
    @Output() public dataChange = new EventEmitter<any>();
    public title = $localize`Sichtbarkeitsbedingung für Antwort oder Unterfrage`;

    constructor() { }

    public close() {
        this.dataChange.emit(this.data);
    }
}
