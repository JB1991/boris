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

    @Output() public closing: EventEmitter<boolean> = new EventEmitter();

    @Output() public flurstueckChange = new EventEmitter<FeatureCollection>();

    @Output() public selectGemarkungResult = new EventEmitter();

    @Input() public address?: string;

    public fsk?: Flurstueckskennzeichen;

    public selected = false;

    public loading = false;

    public resFuzzy?: FeatureCollection;

    // control for loading spinner if alkisWfs request is running
    public loadingAlkisWfs = false;

    constructor(
        public alkisWfsService: AlkisWfsService,
        public alerts: AlertsService,
        public gemarkungService: GemarkungWfsService,
        private cdr: ChangeDetectorRef
    ) {
        this.reset();
    }

    /**
     * Reset flurstueckskennzeichen onClose
     */
    public reset(): void {
        this.fsk = {
            gemarkung: {
                type: 'Feature',
                geometry: {} as any,
                properties: {}
            },
            flur: '',
            nenner: '',
            zaehler: ''
        };
        this.resFuzzy = undefined;
        this.selected = false;
    }

    /**
     * onInput sets the loading status true if the input field contains characters
     * @param event input event
     */
    public onInput(event: any): void {
        if (event.target.value) {
            this.loading = true;
        }
    }

    /**
     * Return the text property
     * @param feature GeoJSON feature
     * @returns formatted input
     */
    public readonly inputFormatter = (feature: Feature): string => {
        if (feature.properties?.['gemarkung']) {
            return feature.properties['gemarkung'] + ' (' +
                feature.properties['gemarkungsschluessel'] + ')' +
                ' - ' + feature.properties['gemeinde'];
        }
        return '';
    };

    /**
     * search for flurstueck on form submit
     * @param value form values as flurstueckskennzeichen
     */
    public searchFlurstueck(value: Flurstueckskennzeichen): void {
        this.fsk = value;
        this.loadingAlkisWfs = !this.loadingAlkisWfs;
        if (this.fsk?.gemarkung?.properties && this.fsk.flur && this.fsk.zaehler) {
            this.alkisWfsService.getFlurstueckByFsk(
                this.fsk.gemarkung.properties['gemarkungsschluessel'],
                this.fsk.flur,
                this.fsk.zaehler,
                this.fsk?.nenner
            ).subscribe(
                (res: FeatureCollection) => {
                    this.loadingAlkisWfs = !this.loadingAlkisWfs;
                    this.handleHttpResponse(res);},
                (err: HttpErrorResponse) => this.handleHttpError(err)
            );
        }
    }

    /**
     * Handle the HTTP Response
     * @param res response as text/xml
     */
    public handleHttpResponse(res: FeatureCollection): void {
        if (res.features.length > 1) {
            this.resFuzzy = res;
            this.cdr.detectChanges();
            return;
        }
        this.closing.emit(true);
        if (res.features.length === 1) {
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
    public handleHttpError(err: HttpErrorResponse): void {
        this.closing.emit(true);
        this.alerts.NewAlert(
            'danger',
            $localize`Laden fehlgeschlagen`,
            $localize`Anfrage an die WFS-Komponente gescheitert, bitte versuchen Sie es später erneut.`
        );
    }

    /**
     * Pass the search input to the Geosearch service
     * @param text$ Input as Observable
     * @returns Search Observable
     */
    public readonly search = (text$: Observable<string>): Observable<Feature[]> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term) => (term.length < 1 ? of([]) :
                this.gemarkungService.getGemarkungBySearchText(term).pipe(
                    catchError((error) => {
                        this.alerts.NewAlert('danger', $localize`Es ist ein Fehler aufgetreten`, error.message);
                        return of([] as any);
                    })
                ))
            ),
            map((result: FeatureCollection) => {
                this.loading = false;
                this.cdr.detectChanges();
                return result['features'];
            })
        );

    /**
     * onSelectFlurstueck select an item from the fuzzy result list
     * @param index index of selected Flurstueck
     */
    public onSelectFlurstueck(index: number): void {
        this.resFuzzy?.features.forEach((ft: Feature, i) => {
            if (i !== index) {
                this.resFuzzy?.features.splice(i, 1);
            }
        });
        if (this.resFuzzy) {
            this.flurstueckChange.next(this.resFuzzy);
            this.alkisWfsService.updateFeatures(this.resFuzzy);
        }
        this.closing.emit(true);
    }

    /**
     * Select an item from the search result list
     * @param item GeoJSON feature
     */
    public onSelect(item: any): void {
        this.selectGemarkungResult.next(item);
        this.gemarkungService.updateFeatures(item);
        this.selected = true;
    }

    /**
     * onEmpty sets selected to false if the input field gemarkung is empty
     * @param key pressed key
     */
    public onEmpty(key: any): void {
        if ((key === 'Backspace' || key === 'Delete') && this.fsk?.gemarkung) {
            this.selected = false;
        }
    }
}

/**
 * Type for Flurstueckskennzeichen
 */
export interface Flurstueckskennzeichen {
    gemarkung?: Feature;
    flur?: string;
    nenner?: string;
    zaehler?: string;
}
