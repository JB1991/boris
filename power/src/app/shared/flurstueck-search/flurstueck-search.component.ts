import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../alerts/alerts.service';
import { AlkisWfsService } from './alkis-wfs.service';
import * as XMLParser from 'fast-xml-parser';
import { BBox } from 'geojson';
import * as lo from 'lodash';

@Component({
    selector: 'power-flurstueck-search',
    templateUrl: './flurstueck-search.component.html',
    styleUrls: ['./flurstueck-search.component.scss']
})
export class FlurstueckSearchComponent implements OnInit {

    private gemarkung = '5328';
    private flur = '003';
    private zaehler = '00079';
    private nenner = '0001';

    constructor(
        public alkisWfsService: AlkisWfsService,
        public alerts: AlertsService
    ) { }

    ngOnInit(): void {
    }

    public getFlurstueck() {
        this.alkisWfsService.getFlurstueckByFsk(this.gemarkung, this.flur, this.zaehler, this.nenner)
            .subscribe(
                res => this.alkisWfsService.updateFeatures(this.parseXMLtoFlurstueck(res)),
                err => {
                    console.log(err);
                    this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, err.message);
                }
            );
    }

    private parseXMLtoFlurstueck(xmlData: string): Flurstueck {
        let fst: Flurstueck;
        const options = {
            ignoreNameSpace: true
        };

        let result = XMLParser.validate(xmlData);
        if (result) {
            let obj = XMLParser.parse(xmlData, options);
            fst = this.retrieveFlurstueckData(obj);
        }
        return fst;
    }

    private retrieveFlurstueckData(object: any): Flurstueck {

        let axFlurstueck = lo.get(object, 'FeatureCollection.member.AX_Flurstueck');
        let bounds = lo.get(object, 'FeatureCollection.boundedBy.Envelope');

        let fst: Flurstueck = {
            gemarkung: lo.get(axFlurstueck, 'gemarkung.AX_Gemarkung_Schluessel.gemarkungsnummer'),
            land: axFlurstueck['gemarkung']['AX_Gemarkung_Schluessel']['land'],
            flur: axFlurstueck['flurnummer'],
            nenner: axFlurstueck['flurstuecksnummer']['AX_Flurstuecksnummer']['nenner'],
            zaehler: axFlurstueck['flurstuecksnummer']['AX_Flurstuecksnummer']['zaehler'],
            fsk: axFlurstueck['flurstueckskennzeichen'],
            flaeche: axFlurstueck['amtlicheFlaeche'],
            bbox: this.getFstBBox(bounds),
        }
        return fst;
    }

    private getFstBBox(bounds: any): BBox {
        let lowerCorner: string = lo.get(bounds, 'lowerCorner');
        let upperCorner: string = lo.get(bounds, 'upperCorner');
        let lc = lowerCorner.split(' ')
        let uc = upperCorner.split(' ');
        let bbox: BBox = [
            Number(lc[0]),
            Number(lc[1]),
            Number(uc[0]),
            Number(uc[1])
        ];
        return bbox;
    }

}

export interface Flurstueck {
    gemarkung: number;
    land: number;
    flur: number;
    nenner: number;
    zaehler: number;
    fsk: string;
    bbox: BBox;
    flaeche: number;
}
