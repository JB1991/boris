import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { EinflussgroessePipe } from '@app/bodenrichtwert/pipes/einflussgroesse.pipe';
import { ObjectIdPipe } from '@app/bodenrichtwert/pipes/object-id.pipe';
import { BeitragPipe } from '@app/bodenrichtwert/pipes/beitrag.pipe';

@Component({
    selector: 'power-bodenrichtwert-detail-umrechnung',
    templateUrl: './umrechnung.component.html',
    styleUrls: ['./umrechnung.component.scss'],
    providers: [EinflussgroessePipe, ObjectIdPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UmrechnungComponent implements OnInit {
    @ViewChild('umrechnung_modal') public modal: ModalminiComponent;
    @Input() public table: UmrechnungsTable;
    @Input() public brw: number;
    @Input() public actualValue: string;

    strings = {
        'koef': $localize`Umrechnungskoeffizient`,
    };

    public discrete: Array<string> = ['BEIT', 'NUTA', 'Art der Bebauung', 'BAUW', 'BOD', 'HINW', 'GEZ'];
    public continuous: Array<string> = ['WGFZ', 'GRZ', 'BMZ', 'FLAE', 'GTIE', 'GBREI', 'ACZA', 'GRZA'];

    public einflussgroesse: string;
    public objectId: string;
    public actualKoef: UmrechnungsItem;

    constructor(
        private einflussgroessePipe: EinflussgroessePipe,
        private objectIdPipe: ObjectIdPipe,
    ) { }

    ngOnInit(): void {
        this.einflussgroesse = this.einflussgroessePipe.transform(this.table.text);
        this.objectId = this.objectIdPipe.transform(this.table.objid);
        this.table.werte = this.sortBezugswerte(this.table.werte);
        this.actualKoef = this.findActualItem(this.table.werte);
    }

    public sortBezugswerte(array) {
        return array.sort((a, b) => a.bzwt - b.bzwt);
    }

    /**
     * Returns the Item (bzwt, koef) for the actual value of an UmrechnungsTable
     * @param werte 
     */
    public findActualItem(werte: Array<UmrechnungsItem>) {
        let item: UmrechnungsItem;

        if (this.discrete.includes(this.table.text)) {
            item = this.handleDiscreteValues(werte);
        } else if (this.continuous.includes(this.table.text)) {
            item = werte.find(i => i.bzwt === Number(this.actualValue));
            if (!item) {
                item = this.handleContinuousValues(werte, this.actualValue);
            }
        }

        return item;
    }

    /**
     * Handles the interpolation for continuous values and returns the result as
     * a UmrechnungsItem
     * @param values array with UmrechnungsItems
     * @param actualValue actual value 
     */
    public handleContinuousValues(values: Array<UmrechnungsItem>, actualValue: string): UmrechnungsItem {
        const value = Number(actualValue);
        let item: UmrechnungsItem = {
            bzwt: 0,
            koef: 0,
        };

        // find nearest value from table
        const nearestValue = values.reduce(function (prev, curr) {
            return (Math.abs(curr.bzwt - value) < Math.abs(prev.bzwt - value) ? curr : prev);
        });

        const i = values.indexOf(nearestValue);
        let m: number;

        // nearest > actual OR last item of table
        if ((nearestValue.bzwt > value && i > 0) || i === values.length - 1) {
            m = (values[i].koef - values[i - 1].koef) / (values[i].bzwt - values[i - 1].bzwt);
            // nearest < actual OR first item of table
        } else if ((nearestValue.bzwt < value && i < values.length - 1) || i === 0) {
            m = (values[i].koef - values[i + 1].koef) / (values[i].bzwt - values[i + 1].bzwt);
        }

        // interpolate koef for actual value -> y = b + m * x;
        const b = nearestValue.koef;
        const x = value - nearestValue.bzwt;
        const y = b + m * x;

        item.bzwt = value;
        item.koef = y;

        return item;
    }

    /**
     * Handles and returns the UmrechnungsItem for discrete values
     * @param values 
     */
    public handleDiscreteValues(values: Array<UmrechnungsItem>): UmrechnungsItem {
        let item: UmrechnungsItem;
        if (this.table.text === 'Art der Bebauung') {
            if (this.actualValue.toString() === 'EFH') {
                item = values.find(i => i.bzwt === 1);
            } else if (this.actualValue.toString() === 'MFH') {
                item = values.find(i => i.bzwt === 2);
            }
        } else {
            item = values.find(i => i.bzwt.toString() === this.actualValue);
        }
        return item;
    }

    public open() {
        const title = $localize`Umrechnungskoeffizient:` + ' ' + this.einflussgroesse + ' (' + this.objectId + ')';
        this.modal.open(title);
    }

    public close() {
        this.modal.close();
    }
}

export interface UmrechnungsTable {
    objid: string;
    text: string;
    umstet: string;
    umart: string;
    werte: Array<UmrechnungsItem>;
}

export interface UmrechnungsItem {
    bzwt: number;
    koef: number;
}
