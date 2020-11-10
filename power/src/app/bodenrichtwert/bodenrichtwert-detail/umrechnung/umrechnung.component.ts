import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { EinflussgroessePipe } from '@app/bodenrichtwert/pipes/einflussgroesse.pipe';

@Component({
    selector: 'power-bodenrichtwert-detail-umrechnung',
    templateUrl: './umrechnung.component.html',
    styleUrls: ['./umrechnung.component.scss'],
    providers: [EinflussgroessePipe]
})
export class UmrechnungComponent implements OnInit {
    @ViewChild('umrechnung_modal') public modal: ModalminiComponent;
    @Input() public data = {
        objid: '',
        text: '',
        umstet: '',
        umart: '',
        werte: []
    };

    einflussgroesse;

    constructor(private pipe: EinflussgroessePipe) {
    }

    ngOnInit(): void {
        this.einflussgroesse = this.pipe.transform(this.data.text);
    }

    public open() {
        this.modal.open($localize`Umrechnungskoeffizienten mit Bezug auf die` + ' ' +
            this.einflussgroesse);
    }

    public close() {
        this.modal.close();
    }

}
