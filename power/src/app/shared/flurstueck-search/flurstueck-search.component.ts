import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AlertsService } from '../alerts/alerts.service';
import { AlkisWfsService } from './alkis-wfs.service';
import { GemarkungWfsService } from './gemarkung-wfs.service';
import { Feature, FeatureCollection } from 'geojson';
import { ModalminiComponent } from '../modalmini/modalmini.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Component({
    selector: 'power-flurstueck-search',
    templateUrl: './flurstueck-search.component.html',
    styleUrls: ['./flurstueck-search.component.scss']
})

export class FlurstueckSearchComponent {
    @ViewChild('flurstueckssearchmodal') public modal: ModalminiComponent;

    public title = $localize`Flurstückssuche`;

    public fsk: Flurstueckskennzeichen;
    @Output() fskChange = new EventEmitter();

    public selected = false;

    @Output() selectResult = new EventEmitter();

    @Input() adresse: string;

    public model: any;

    filteredResults: Feature[];

    constructor(
        public alkisWfsService: AlkisWfsService,
        public alerts: AlertsService,
        public gemarkungService: GemarkungWfsService
    ) {
        this.fsk = {};
        this.selected = false;
    }

    /**
     * Return the text property
     * @param feature GeoJSON feature
     */
    public inputFormatter = (feature) =>
        feature.properties.gemarkung + ' (' +
        feature.properties.gemarkungsschluessel + ')' +
        ' - ' + feature.properties.gemeinde;

    /**
     * Reset flurstueckskennzeichen onClose
     */
    public onClose() {
        this.fsk = {};
        this.selected = false;
    }

    /**
     * search for flurstueck on form submit
     * @param value form values as flurstueckskennzeichen
     */
    public searchFlurstueck(value: Flurstueckskennzeichen) {
        this.fsk = value;
        
        this.alkisWfsService.getFlurstueckByFsk(
            this.fsk.gemarkung.properties.gemarkungsschluessel,
            this.fsk.flur,
            this.fsk.zaehler,
            this.fsk.nenner
        ).subscribe(
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
            this.fskChange.emit();
        } else {
            this.alerts.NewAlert(
                'danger',
                $localize`Laden fehlgeschlagen`,
                $localize`Flurstück nicht gefunden.`
            );
        }
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

    /**
     * Pass the search input to the Geosearch service
     * @param text$ Input as Observable
     */
    public search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => term.length < 1 ? of([]) :
                this.gemarkungService.getGemarkungBySearchText(term).pipe(
                    catchError((error) => {
                        console.log(error);
                        this.alerts.NewAlert('danger', $localize`Es ist ein Fehler aufgetreten`, error.message);
                        return of([]);
                    })
                )
            ),
            map(result => result['features'])
        );

    /**
     * Select an item from the search result list
     * @param item GeoJSON feature
     */
    public onSelect(item: any) {
        this.selectResult.next(item);
        this.gemarkungService.updateFeatures(item);
        this.selected = true;
    }

    /**
     * onEmpty sets selected to false if the input field gemarkung is empty
     * @param key pressed key
     */
    public onEmpty(key: any) {
        if ((key === 'Backspace' || key === 'Delete') && this.fsk.gemarkung) {
            this.selected = false;
        }
    }
}

export interface Flurstueckskennzeichen {
    gemarkung?: Feature;
    flur?: string;
    nenner?: string;
    zaehler?: string;
}
