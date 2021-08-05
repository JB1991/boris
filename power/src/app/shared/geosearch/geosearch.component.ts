import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectionStrategy, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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

    @ViewChild('geosearchInput') geosearchElement: ElementRef;

    constructor(
        public geosearchService: GeosearchService,
        public alerts: AlertsService,
        private cdr: ChangeDetectorRef
    ) { }

    @Output() selectResult = new EventEmitter();

    @Input() address: string;

    public model: Feature;

    public loading = false;

    /**
     * Return the text property
     * @param feature GeoJSON feature
     * @returns Text
     */
    public inputFormatter = (feature: Feature) => feature.properties.text;

    /**
     * Initialization of the search form
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.address) {
            this.model = changes.address.currentValue;
        }
    }

    /* istanbul ignore next */
    /**
     * setFocus sets the focus on the geosearch input field
     */
    public setFocus() {
        // eslint-disable-next-line
        setTimeout(() => {
            this.geosearchElement.nativeElement.focus();
        });
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
     * Pass the search input to the Geosearch service
     * @param text$ Input as Observable
     * @returns Observable
     */
    public search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => term.length < 1 ? of([]) :
                this.geosearchService.search(term).pipe(
                    catchError(() => {
                        this.alerts.NewAlert('danger', $localize`Angegebene Adresse konnte nicht gefunden werden.`, $localize`Adresse` + ': ' + term);
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
    public onSelect(item: Feature) {
        this.selectResult.next(item);
        this.geosearchService.updateFeatures(item);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
