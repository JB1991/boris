import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { GeosearchService } from './geosearch.service';
import { Observable, of } from 'rxjs';
import { Feature } from 'geojson';
import { AlertsService } from '../alerts/alerts.service';

@Component({
    selector: 'power-geosearch',
    templateUrl: './geosearch.component.html',
    styleUrls: ['./geosearch.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeosearchComponent implements OnChanges {

    constructor(public geosearchService: GeosearchService, public alerts: AlertsService) {
    }

    @Input() resetGeosearch: boolean;
    @Output() resetGeosearchChange = new EventEmitter();

    @Output() selectResult = new EventEmitter();

    @Input() isCollapsed: boolean;

    public model: any;

    filteredResults: Feature[];

    /**
     * Return the text property
     * @param feature GeoJSON feature
     */
    inputFormatter = (feature) => feature.properties.text;

    resultFormatter = (feature) => feature.properties.text;

    /**
     * Initialization of the search form
     */

    ngOnChanges() {
        if (this.resetGeosearch && this.model) {
            this.model = undefined;
            this.resetGeosearchChange.emit(false);
        }
    }

    /**
     * Pass the search input to the Geosearch service
     * @param text$ Input as Observable
     */
    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => term.length < 1 ? of([]) :
                this.geosearchService.search(term).pipe(
                    catchError((error) => {
                        console.log(error);
                        this.alerts.NewAlert('danger', $localize`Es ist ein Fehler aufgetreten`, error.message);
                        return of([]);
                    })
                )
            ),
            map(result => result['features'])
        )

    /**
     * Select an item from the search result list
     * @param item GeoJSON feature
     */
    onSelect(item: any) {
        this.selectResult.next(item);
        this.geosearchService.updateFeatures(item);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
