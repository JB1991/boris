import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { EinflussgroessePipe } from '@app/bodenrichtwert/pipes/einflussgroesse.pipe';
import { ObjectIdPipe } from '@app/bodenrichtwert/pipes/object-id.pipe';

@Component({
    selector: 'power-bodenrichtwert-detail-umrechnung',
    templateUrl: './umrechnung.component.html',
    styleUrls: ['./umrechnung.component.scss'],
    providers: [EinflussgroessePipe, ObjectIdPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UmrechnungComponent implements OnInit {
    @ViewChild('umrechnung_modal') public modal: ModalminiComponent;
    @Input() public table: ConversionTable;
    @Input() public brw: number;
    @Input() public actualValue: any;

    strings = {
        'koef': $localize`Umrechnungskoeffizient`,
    };

    public einflussgroesse: string;
    public objectId: string;
    public actualKoef: any;

    constructor(private einflussgroessePipe: EinflussgroessePipe,
        private objectIdPipe: ObjectIdPipe) {
    }

    ngOnInit(): void {
        this.einflussgroesse = this.einflussgroessePipe.transform(this.table.text);
        this.objectId = this.objectIdPipe.transform(this.table.objid);
        this.table.werte = this.sortBezugswerte(this.table.werte);
        this.actualKoef = this.findActualKoef(this.table.werte);
    }

    sortBezugswerte(array) {
        return array.sort((a, b) => a.bzwt - b.bzwt);
    }

    private findActualKoef(werte: Array<ConversionItem>) {
        let item: ConversionItem;
        if (this.table.text === 'Art der Bebauung') {
            if (this.actualValue.toString() === 'EFH') {
                item = werte.find(i => i.bzwt === 1);
                return item ? item.koef : undefined;
            } else if (this.actualValue.toString() === 'MFH') {
                item = werte.find(i => i.bzwt === 2);
                return item ? item.koef : undefined;
            }
        } else if (this.table.text === 'FLAE') {
            let roundedValue = Math.round(this.actualValue / 100) * 100;
            item = werte.find(i => i.bzwt === roundedValue);
            return item ? item.koef : undefined;
        } else {
            item = werte.find(i => i.bzwt.toString() === this.actualValue);
            return item ? item.koef : undefined;
        }
        return undefined;
    }

    public open() {
        const title = $localize`Umrechnungskoeffizient:` + ' ' + this.einflussgroesse + ' (' + this.objectId + ')';
        this.modal.open(title);
    }

    public close() {
        this.modal.close();
    }
}

export interface ConversionTable {
    objid: string;
    text: string;
    umstet: string;
    umart: string;
    werte: Array<ConversionItem>;
}

export interface ConversionItem {
    bzwt: number;
    koef: number;
}