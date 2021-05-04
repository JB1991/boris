import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { AlkisWfsService } from './alkis-wfs.service';
import { GemarkungWfsService } from './gemarkung-wfs.service';
import { Feature, FeatureCollection } from 'geojson';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'power-flurstueck-search',
    templateUrl: './flurstueck-search.component.html',
    styleUrls: ['./flurstueck-search.component.scss']
})

export class FlurstueckSearchComponent {

    public fsk: Flurstueckskennzeichen;

    public selected = false;

    public loading = false;

    @Output() public closing: EventEmitter<boolean> = new EventEmitter();

    @Output() flurstueckChange = new EventEmitter<FeatureCollection>();

    @Output() selectGemarkungResult = new EventEmitter();

    @Input() address: string;

    constructor(
        public alkisWfsService: AlkisWfsService,
        public alerts: AlertsService,
        public gemarkungService: GemarkungWfsService,
        private cdr: ChangeDetectorRef
    ) {
        this.fsk = {};
        this.selected = false;
    }

    /**
     * Reset flurstueckskennzeichen onClose
     */
    public reset() {
        this.fsk = {};
        this.selected = false;
    }

    /**
     * onInput sets the loading status true if the input field contains characters
     * @param event input event
     */
    public onInput(event: any) {
        if (event.target.value) {
            this.loading = true;
        }
    }

    /**
     * Return the text property
     * @param feature GeoJSON feature
     */
    public inputFormatter = (feature: Feature) =>
        feature.properties.gemarkung + ' (' +
        feature.properties.gemarkungsschluessel + ')' +
        ' - ' + feature.properties.gemeinde;

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
        this.closing.emit(true);
    }

    /**
     * Handle the HTTP Response
     * @param res response as text/xml
     */
    public handleHttpResponse(res: FeatureCollection) {
        if (res.features.length > 0) {
            this.flurstueckChange.next(res);
            this.alkisWfsService.updateFeatures(res);
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
                        this.alerts.NewAlert('danger', $localize`Es ist ein Fehler aufgetreten`, error.message);
                        return of([]);
                    })
                )
            ),
            map(result => {
                this.loading = false;
                this.cdr.detectChanges();
                return result['features'];
            })
        );

    /**
     * Select an item from the search result list
     * @param item GeoJSON feature
     */
    public onSelect(item: any) {
        this.selectGemarkungResult.next(item);
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
