import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { GeosearchService } from './geosearch.service';
import { Observable, of } from 'rxjs';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { AlertsService } from '../alerts/alerts.service';

@Component({
    selector: 'power-geosearch',
    templateUrl: './geosearch.component.html',
    styleUrls: ['./geosearch.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeosearchComponent implements OnChanges {
    @ViewChild('geosearchInput') public geosearchElement?: ElementRef;
    @Output() public selectResult = new EventEmitter();
    @Input() public address?: Feature;
    public model?: Feature;
    public loading = false;

    constructor(
        public geosearchService: GeosearchService,
        public alerts: AlertsService,
        private cdr: ChangeDetectorRef
    ) { }

    /**
     * Return the text property
     * @param feature GeoJSON feature
     * @returns text property of the feature
     */
    public readonly inputFormatter = (feature: Feature): string => {
        if (feature.properties) {
            return feature.properties['text'];
        }
        return '';
    };

    /** @inheritdoc */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['address']) {
            this.model = changes['address'].currentValue;
        }
    }

    /* istanbul ignore next */
    /**
     * setFocus sets the focus on the geosearch input field
     */
    public setFocus(): void {
        // eslint-disable-next-line
        setTimeout(() => {
            this.geosearchElement?.nativeElement.focus();
        });
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
     * Selects text of input element
     * @param event input event
     */
    public onFocus(event: any): void {
        (event.target as HTMLInputElement).select();
    }

    /**
     * Pass the search input to the Geosearch service
     * @param text$ Input as Observable
     * @returns Observable
     */
    public readonly search = (text$: Observable<string>): Observable<Array<Feature<Geometry, GeoJsonProperties>>> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => term.length < 1 ? of([]) :
                this.geosearchService.search(term).pipe(
                    catchError(() => {
                        this.alerts.NewAlert('danger', $localize`Angegebene Adresse konnte nicht gefunden werden.`, $localize`Adresse` + ': ' + term);
                        return of({} as any);
                    })
                )
            ),
            map((result: FeatureCollection) => {
                this.loading = false;
                this.cdr.detectChanges();
                return result['features'];
            })
        );

    /**
     * Select an item from the search result list
     * @param item GeoJSON feature
     */
    public onSelect(item: Feature): void {
        this.selectResult.next(item);
        this.geosearchService.updateFeatures(item);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
