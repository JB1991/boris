import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
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

  constructor(private fb: FormBuilder, private geosearchService: GeosearchService) {
  }

  @Output() selectResult = new EventEmitter();

  public model: any;

  searchForm: FormGroup;
  filteredResults: Feature[];
  searching: boolean;
  searchFailed: boolean;

  formatter = (result) => result.properties.text;

  ngOnInit() {
    this.searchForm = this.fb.group({
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

  displayFn(result: Feature) {
    if (result) {
      return result.properties.name;
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.geosearchService.search(term).pipe(
          tap(() => this.searching = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => this.searching = false),
      map(res => res['features'])
    )

  selectItem(item: any) {
    this.selectResult.next(item);
    this.geosearchService.updateFeatures(item);
  }

}
