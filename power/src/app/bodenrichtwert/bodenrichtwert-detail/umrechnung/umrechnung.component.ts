import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { ArtDerBebauungPipe } from '@app/bodenrichtwert/pipes/art-der-bebauung.pipe';
import { EinflussgroessePipe } from '@app/bodenrichtwert/pipes/einflussgroesse.pipe';
import { ObjectIdPipe } from '@app/bodenrichtwert/pipes/object-id.pipe';

@Component({
    selector: 'power-bodenrichtwert-detail-umrechnung',
    templateUrl: './umrechnung.component.html',
    styleUrls: ['./umrechnung.component.scss'],
    providers: [ArtDerBebauungPipe, EinflussgroessePipe, ObjectIdPipe]
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

    strings = {
        'koef': $localize`Umrechnungskoeffizient`,
    };

    einflussgroesse: string;
    objectId: string;

    constructor(private artDerBebauungPipe: ArtDerBebauungPipe,
                private einflussgroessePipe: EinflussgroessePipe,
                private objectIdPipe: ObjectIdPipe) {
    }

    ngOnInit(): void {
        this.einflussgroesse = this.einflussgroessePipe.transform(this.data.text);
        this.objectId = this.objectIdPipe.transform(this.data.objid);
        this.data.werte = this.sortBezugswerte(this.data.werte);
        this.transformArtDerBebauung();
    }

    sortBezugswerte(array) {
        return array.sort((a, b) => a.bzwt - b.bzwt);
    }

    transformArtDerBebauung() {
        if (this.data.text === 'Art der Bebauung') {
            this.data.werte.forEach(wert => {
                wert.bzwt = this.artDerBebauungPipe.transform(wert.bzwt);
            });
        }
    }

    public open() {
        const title = $localize`Umrechnungskoeffizient:` + ' ' + this.einflussgroesse + ' (' + this.objectId + ')';
        this.modal.open(title);
    }

    public close() {
        this.modal.close();
    }
}
