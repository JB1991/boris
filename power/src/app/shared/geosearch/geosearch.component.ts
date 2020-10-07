import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeosearchService } from './geosearch.service';
import { Observable, of } from 'rxjs';
import { Feature } from 'geojson';

@Component({
    selector: 'power-geosearch',
    templateUrl: './geosearch.component.html',
    styleUrls: ['./geosearch.component.scss'],
})
export class GeosearchComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, public geosearchService: GeosearchService) {
    }

    @Output() selectResult = new EventEmitter();

    public model: any;

    searchForm: FormGroup;
    filteredResults: Feature[];
    searchFailed = false;

    /**
     * Return the text property
     * @param feature GeoJSON feature
     */
    formatter = (feature) => feature.properties.text;

    /**
     * Initialization of the search form
     */
    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            searchInput: null
        });

        this.searchForm
            .get('searchInput')
            .valueChanges
            .pipe(
                debounceTime(300),
                filter(value => {
                    // check if value is empty string
                    return value === undefined || value !== '';
                }),
                switchMap(value => this.geosearchService.search(value))
            )
            .subscribe(result => {
                this.filteredResults = result.features;
            });
    }

    /**
     * Pass the search input to the Geosearch service
     * @param text$ Input as Observable
     */
    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term =>
                this.geosearchService.search(term).pipe(
                    catchError(() => {
                        this.searchFailed = true;
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
    selectItem(item: any) {
        this.selectResult.next(item);
        this.geosearchService.updateFeatures(item);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
