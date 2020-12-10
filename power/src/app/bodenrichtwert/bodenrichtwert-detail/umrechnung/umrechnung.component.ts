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
    @Input() public data = {
        objid: '',
        text: '',
        umstet: '',
        umart: '',
        werte: [
            {
                bzwt: 0,
                koef: 0
            }
        ]
    };
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
        this.einflussgroesse = this.einflussgroessePipe.transform(this.data.text);
        this.objectId = this.objectIdPipe.transform(this.data.objid);
        this.data.werte = this.sortBezugswerte(this.data.werte);
        this.actualKoef = this.findActualKoef(this.data.werte);
    }

    sortBezugswerte(array) {
        return array.sort((a, b) => a.bzwt - b.bzwt);
    }

    private findActualKoef(werte: any) {
        let val: any;
        if (this.data.text === 'Art der Bebauung') {
            if (this.actualValue.toString() === 'EFH') {
                val = werte.find((v: any) => v.bzwt === 1);
                if (val) {
                    return val.koef
                }
            } else if (this.actualValue.toString() === 'MFH') {
                val = werte.find((v: any) => v.bzwt === 2);
                if (val) {
                    return val.koef
                }
            }
        } else if (this.data.text === 'FLAE') {
            let roundedVal = Math.round(this.actualValue / 100) * 100;
            val = werte.find((v: any) => v.bzwt.toString() === roundedVal.toString());
            if (val) {
                return val.koef
            }
        } else {
            val = werte.find((v: any) => v.bzwt === this.actualValue);
            if (val) {
                return val.koef
            }
        }
        return val;
    }

    public open() {
        const title = $localize`Umrechnungskoeffizient:` + ' ' + this.einflussgroesse + ' (' + this.objectId + ')';
        this.modal.open(title);
    }

    public close() {
        this.modal.close();
    }
}
