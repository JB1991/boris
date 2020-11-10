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
        this.data.werte = this.sortBezugswerte(this.data.werte);
    }

    sortBezugswerte(array) {
        return array.sort((a, b) => a.bzwt - b.bzwt);
    }

    public open() {
        this.modal.open($localize`Umrechnungskoeffizient:` + ' ' + this.einflussgroesse);
    }

    public close() {
        this.modal.close();
    }

}
