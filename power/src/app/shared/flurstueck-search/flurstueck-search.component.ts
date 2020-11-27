import { Component, ViewChild } from '@angular/core';
import { AlertsService } from '../alerts/alerts.service';
import { AlkisWfsService } from './alkis-wfs.service';
import * as XMLParser from 'fast-xml-parser';
import { BBox } from 'geojson';
import * as lo from 'lodash';
import { ModalminiComponent } from '../modalmini/modalmini.component';
import { HttpErrorResponse } from '@angular/common/http';
import * as epsg from 'epsg';
import proj4 from 'proj4';

@Component({
    selector: 'power-flurstueck-search',
    templateUrl: './flurstueck-search.component.html',
    styleUrls: ['./flurstueck-search.component.scss']
})
export class FlurstueckSearchComponent {
    @ViewChild('flurstueckssearchmodal') public modal: ModalminiComponent;

    public title = $localize`Flurstückssuche`;

    public fsk: Flurstueckskennzeichen;

    constructor(
        public alkisWfsService: AlkisWfsService,
        public alerts: AlertsService
    ) {
        this.fsk = {};
    }

    /**
     * Reset flurstueckskennzeichen onClose
     */
    public onClose() {
        this.fsk = {};
    }

    /**
     * search for flurstueck on form submit
     * @param value form values as flurstueckskennzeichen
     */
    public searchFlurstueck(value: Flurstueckskennzeichen) {
        this.fsk = value;
        this.alkisWfsService.getFlurstueckByFsk(this.fsk.gemarkung, this.fsk.flur, this.fsk.zaehler, this.fsk.nenner)
            .subscribe(
                (res: string) => this.handleHttpResponse(res),
                (err: HttpErrorResponse) => this.handleHttpError(err)
            );
        this.modal.close();
    }

    /**
     * Handle the HTTP Response
     * @param res response as text/xml
     */
    public handleHttpResponse(res: string) {
        let ft = this.parseXML(res);
        if (!ft) {
            this.alerts.NewAlert(
                'danger',
                $localize`Laden fehlgeschlagen`,
                $localize`Flurstück nicht gefunden.`
            );
        } else {
            this.alkisWfsService.updateFeatures(ft);
        }
    }

    /**
     * Handle the HTTP Error Response
     * @param err error
     */
    public handleHttpError(err: HttpErrorResponse) {
        console.log(err);
        this.alerts.NewAlert(
            'danger',
            $localize`Laden fehlgeschlagen`,
            err.message
        );
    }

    /**
     * Parse the XML-Data
     * @param xmlData xmlData as string
     */
    private parseXML(xmlData: string): Flurstueck {
        let fst: Flurstueck;

        // parse options
        const options = {
            ignoreNameSpace: true,
        };

        // parse XML if valid
        if (XMLParser.validate(xmlData)) {
            let obj = XMLParser.parse(xmlData, options);
            // check if obj contains features
            if (obj['FeatureCollection']) {
                fst = this.parseFlurstuecksData(obj);
            }
        }
        return fst;
    }

    /**
     * Parse the object with flurstuecks data
     * @param object object to parse
     */
    private parseFlurstuecksData(object: any): Flurstueck {

        // AX_Flurstueck node
        let axFlurstueck = lo.get(object, 'FeatureCollection.member.AX_Flurstueck');

        // Envelope node with bbox
        let bounds = lo.get(object, 'FeatureCollection.boundedBy.Envelope');

        let fst: Flurstueck = {
            gemarkung: lo.get(axFlurstueck, 'gemarkung.AX_Gemarkung_Schluessel.gemarkungsnummer'),
            land: lo.get(axFlurstueck, 'gemarkung.AX_Gemarkung_Schluessel.land'),
            flur: lo.get(axFlurstueck, 'flurnummer'),
            nenner: lo.get(axFlurstueck, 'flurstuecksnummer.AX_Flurstuecksnummer.nenner'),
            zaehler: lo.get(axFlurstueck, 'flurstuecksnummer.AX_Flurstuecksnummer.zaehler'),
            fsk: lo.get(axFlurstueck, 'flurstueckskennzeichen'),
            flaeche: lo.get(axFlurstueck, 'amtlicheFlaeche'),
            bbox: this.parseFlurstueckBBox(bounds),
        }
        return fst;
    }

    /**
     * Transforms coordinates from one projection to another projection (EPSG-Codes)
     * @param from projection from
     * @param to projection to
     * @param coord coordinates [x, y] 
     */
    private transformCoordinates(from: string, to: string, coord: Number[]) {
        let result = proj4(from, to).forward(coord);
        return result;
    }

    /**
     * Parse the object with bbox
     * @param bounds object with bounds
     */
    private parseFlurstueckBBox(bounds: any): BBox {
        // extract coordinates
        let lowerCorner = lo.get(bounds, 'lowerCorner').split(' ');
        let upperCorner = lo.get(bounds, 'upperCorner').split(' ');
        let lc = [Number(lowerCorner[0]), Number(lowerCorner[1])];
        let uc = [Number(upperCorner[0]), Number(upperCorner[1])];

        // projections
        let epsg25832 = epsg['EPSG:25382'];
        let epsg4326 = epsg['EPSG:4326'];

        // transform
        let transLc = this.transformCoordinates(epsg25832, epsg4326, lc);
        let transUc = this.transformCoordinates(epsg25832, epsg4326, uc);

        let bbox: BBox = [
            transLc[0],
            transLc[1],
            transUc[0],
            transUc[1]
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

export interface Flurstueckskennzeichen {
    gemarkung?: string;
    flur?: string;
    nenner?: string;
    zaehler?: string;
}
