import { Component, ViewChild } from '@angular/core';
import { AlertsService } from '../alerts/alerts.service';
import { AlkisWfsService } from './alkis-wfs.service';
import { BBox, FeatureCollection } from 'geojson';
import { ModalminiComponent } from '../modalmini/modalmini.component';
import { HttpErrorResponse } from '@angular/common/http';


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
                (res: FeatureCollection) => this.handleHttpResponse(res),
                (err: HttpErrorResponse) => this.handleHttpError(err)
            );
        this.modal.close();
    }

    /**
     * Handle the HTTP Response
     * @param res response as text/xml
     */
    public handleHttpResponse(res: FeatureCollection) {
        if (res.features.length > 0) {
            this.alkisWfsService.updateFeatures(res);
        } else {
            this.alerts.NewAlert(
                'danger',
                $localize`Laden fehlgeschlagen`,
                $localize`Flurstück nicht gefunden.`
            );
        }
        console.log(res);
    }

    /**
     * Handle the HTTP Error Response
     * @param err error
     */
    public handleHttpError(err: HttpErrorResponse) {
        this.alerts.NewAlert(
            'danger',
            $localize`Laden fehlgeschlagen`,
            $localize`Anfrage an die WFS-Komponente gescheitert, bitte versuchen Sie es später erneut.`
        );
    }
}

export interface Flurstueckskennzeichen {
    gemarkung?: string;
    flur?: string;
    nenner?: string;
    zaehler?: string;
}
