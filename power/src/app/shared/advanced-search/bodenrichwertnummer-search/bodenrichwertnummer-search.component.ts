import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Teilmarkt } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import polylabel from 'polylabel';
import area from '@turf/area';

@Component({
    selector: 'power-bodenrichwertnummer-search',
    templateUrl: './bodenrichwertnummer-search.component.html',
    styleUrls: ['./bodenrichwertnummer-search.component.scss']
})
export class BodenrichwertnummerSearchComponent {

    @ViewChild('advancedSearchModal') public modal?: ModalminiComponent;

    @Input() public stichtag?: string;

    @Input() public teilmarkt?: Teilmarkt;

    @Output() public bodenrichwertChange = new EventEmitter<FeatureCollection>();

    @Output() public closing: EventEmitter<boolean> = new EventEmitter();

    public brwNummer: Feature | undefined;

    public loading = false;

    constructor(
        public alerts: AlertsService,
        public bodenrichtwertService: BodenrichtwertService,
        private cdr: ChangeDetectorRef
    ) {
        this.brwNummer = undefined;
    }

    /**
     * reset bodenrichtwertForm onClose
     */
    public reset(): void {
        this.brwNummer = undefined;
        // manual change detection necessary
        this.cdr.detectChanges();
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
     * Return the wnum (brw-nummer) and brzname property
     * @param feature GeoJSON feature
     * @returns inputFormatter
     */
    public inputFormatter = (feature: Feature): string =>
        feature.properties?.['wnum'] + ' - ' + feature.properties?.['brzname'];

    /**
     * search for selected brw-nummer on form submit
     * @param ft feature
     */
    public searchBodenrichtwert(ft: Feature): void {
        const latLng = this.pointOnPolygon(ft);
        if (latLng && this.teilmarkt) {
            this.bodenrichtwertService.getFeatureByLatLonEntw(latLng[1], latLng[0], this.teilmarkt?.value).subscribe(
                (res: FeatureCollection) => this.handleHttpResponse(res),
                (err: HttpErrorResponse) => this.handleHttpError(err)
            );
            this.closing.emit(true);
        }
    }

    /**
     * pointOnPolygon returns a point on the given feature geometry
     * @param ft feature
     * @returns point
     */
    public pointOnPolygon(ft: Feature): number[] {
        let point: number[];

        switch (ft.geometry.type) {
            case 'Polygon':
                point = polylabel(ft.geometry.coordinates, 0.0001, false);
                break;
            case 'MultiPolygon':
                const p = ft.geometry.coordinates.map(f => ({
                    type: 'Polygon',
                    coordinates: f
                })).sort((i, j) => area(i) - area(j)).shift();

                if (!p) {
                    throw new Error('Something failed');
                }
                point = polylabel(p.coordinates, 0.0001, false);
                break;
            default:
                throw new Error('Unknown geometry');
        }
        return point;
    }

    /**
     * Handle the HTTP Response
     * @param res response as text/xml
     */
    public handleHttpResponse(res: FeatureCollection): void {
        if (res.features.length > 0) {
            this.bodenrichwertChange.next(res);
            this.bodenrichtwertService.updateFeatures(res);
        } else {
            this.alerts.NewAlert(
                'danger',
                $localize`Laden fehlgeschlagen`,
                $localize`Bodenrichtwertzone nicht gefunden.`
            );
        }
    }

    /**
     * Handle the HTTP Error Response
     * @param err error
     */
    public handleHttpError(err: HttpErrorResponse): void {
        this.alerts.NewAlert(
            'danger',
            $localize`Laden fehlgeschlagen`,
            $localize`Anfrage an die WFS-Komponente gescheitert, bitte versuchen Sie es später erneut.`
        );
    }

    /**
     * Pass the search input to the Geosearch service
     * @param text$ Input as Observable
     * @returns search
     */
    public search = (text$: Observable<string>): Observable<Array<Feature<Geometry, { [name: string]: any; }>>> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => term.length < 1 ? of([]) :
                this.bodenrichtwertService.getFeatureByBRWNumber(
                    term, this.stichtag as string,
                    this.teilmarkt as Teilmarkt
                ).pipe(
                    catchError((error) => {
                        this.alerts.NewAlert('danger', $localize`Es ist ein Fehler aufgetreten`, error.message);
                        return of([] as any);
                    })
                )
            ),
            map((result: FeatureCollection) => this.checkFeatures(result))
        );

    /**
     * checkFeatures checks the result for existing features,
     * an alert is returned if the result does not contain any features
     * @param fts result feature collection
     * @returns array with features
     */
    public checkFeatures(fts: FeatureCollection): Array<Feature<Geometry, GeoJsonProperties>> {
        this.loading = false;
        // manual change detection necessary
        this.cdr.detectChanges();
        if (fts.features?.length === 0) {
            this.alerts.NewAlert('info', $localize`Keine Ergebnisse`, $localize`Es konnte leider keine Bodenrichtwertzone gefunden werden.`);
            return [];
        } else {
            return fts.features;
        }
    }
}
