import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { EinflussgroessePipe } from '@app/bodenrichtwert/pipes/einflussgroesse.pipe';
import { ObjectIdPipe } from '@app/bodenrichtwert/pipes/object-id.pipe';

@Component({
    selector: 'power-bodenrichtwert-detail-umrechnung',
    templateUrl: './umrechnung.component.html',
    styleUrls: ['./umrechnung.component.scss'],
    providers: [EinflussgroessePipe, ObjectIdPipe]
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

    einflussgroesse: string;
    objectId: string;

    constructor(private einflussgroessePipe: EinflussgroessePipe,
                private objectIdPipe: ObjectIdPipe) {
    }

    ngOnInit(): void {
        this.einflussgroesse = this.einflussgroessePipe.transform(this.data.text);
        this.objectId = this.objectIdPipe.transform(this.data.objid);
        this.data.werte = this.sortBezugswerte(this.data.werte);
    }

    sortBezugswerte(array) {
        return array.sort((a, b) => a.bzwt - b.bzwt);
    }

    public open() {
        const title = $localize`Umrechnungskoeffizient:` + ' ' + this.einflussgroesse + ' (' + this.objectId + ')';
        this.modal.open(title);
    }

    public close() {
        this.modal.close();
    }
}
