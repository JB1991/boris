import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalminiComponent } from '@app/shared/modalmini/modalmini.component';
import { Feature, FeatureCollection } from 'geojson';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import pointOnFeature from '@turf/point-on-feature';
import polygon from '@turf/unkink-polygon';
import { toWgs84 } from '@turf/projection';
import { Teilmarkt } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';

@Component({
    selector: 'power-bodenrichwertnummer-search',
    templateUrl: './bodenrichwertnummer-search.component.html',
    styleUrls: ['./bodenrichwertnummer-search.component.scss']
})
export class BodenrichwertnummerSearchComponent {

    @ViewChild('advancedSearchModal') public modal: ModalminiComponent;

    @Input() stichtag: string;

    @Input() teilmarkt: Teilmarkt;

    @Output() bodenrichwertChange = new EventEmitter<FeatureCollection>();

    @Output() public closing: EventEmitter<boolean> = new EventEmitter();

    public brwNummer: Feature;

    public loading = false;

    constructor(
        public alerts: AlertsService,
        public bodenrichtwertService: BodenrichtwertService,
        private cdr: ChangeDetectorRef,
    ) {
        this.brwNummer = undefined;
    }

    /**
     * reset bodenrichtwertForm onClose
     */
    public reset() {
        this.brwNummer = undefined;
        // manual change detection necessary
        this.cdr.detectChanges();
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
     * Return the wnum (brw-nummer) and brzname property
     * @param feature GeoJSON feature
     */
    public inputFormatter = (feature: Feature) =>
        feature.properties.wnum + ' - ' + feature.properties.brzname;

    /**
     * search for selected brw-nummer on form submit
     * @param value form value as feature
     * @param ft
     */
    public searchBodenrichtwert(ft: Feature) {
        const latLng = this.pointOnPolygon(ft);
        this.bodenrichtwertService.getFeatureByLatLonEntw(latLng[1], latLng[0], this.teilmarkt.value).subscribe(
            (res: FeatureCollection) => this.handleHttpResponse(res),
            (err: HttpErrorResponse) => this.handleHttpError(err)
        );
        this.closing.emit(true);
    }

    /**
     * pointOnPolygon returns a point on the given feature geometry in WGS84 coordinates
     * @param ft feature
     * @returns point
     */
    public pointOnPolygon(ft: Feature) {
        let poly = polygon(ft.geometry['coordinates']);
        poly = toWgs84(poly);
        const point = pointOnFeature(poly);
        return point.geometry.coordinates;
    }

    /**
     * Handle the HTTP Response
     * @param res response as text/xml
     */
    public handleHttpResponse(res: FeatureCollection) {
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
                this.bodenrichtwertService.getFeatureByBRWNumber(term, this.stichtag, this.teilmarkt).pipe(
                    catchError((error) => {
                        this.alerts.NewAlert('danger', $localize`Es ist ein Fehler aufgetreten`, error.message);
                        return of([]);
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
    public checkFeatures(fts: FeatureCollection) {
        this.loading = false;
        // manual change detection necessary
        this.cdr.detectChanges();
        if (fts.features?.length === 0) {
            this.alerts.NewAlert('info', $localize`Keine Ergebnisse`, $localize`Es konnte leider keine Bodenrichtwertzone gefunden werden.`);
        } else {
            return fts.features;
        }
    }
}
