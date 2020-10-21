import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { AlertsService } from '@app/shared/alerts/alerts.service';
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

    constructor(public alerts: AlertsService) { }

    public close() {
        this.alerts.NewAlert('success', $localize`Änderungen übernommen`,
            $localize`Ihre Änderungen wurden erfolgreich zwischen gespeichert.`);
        this.dataChange.emit(this.data);
    }
}
