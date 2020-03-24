import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Feature, FeatureCollection} from 'geojson';
import {BodenrichtwertService} from '../bodenrichtwert.service';

@Component({
  selector: 'power-bodenrichtwert-liste',
  template: `
    <div class="d-none">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Stichtag</th>
                <th>Nutzung</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let brzone of filteredFeatures" (click)="selectFeature(brzone)">
                <td> {{brzone.properties.stag | date:"yyyy" }}</td>
                <td> {{brzone.properties.nutzung}} </td>
                <td> {{brzone.properties.brw}} </td>
              </tr>
            </tbody>
          </table>
      <div class="d-flex justify-content-between p-2">
        <ngb-pagination [collectionSize]="collectionSize" [(page)]="page" [pageSize]="pageSize">
        </ngb-pagination>

        <select class="custom-select" style="width: auto" [(ngModel)]="pageSize">
          <option [ngValue]="2">2 items per page</option>
          <option [ngValue]="4">4 items per page</option>
          <option [ngValue]="8">8 items per page</option>
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12" *ngFor="let ft of filteredFeatures">
        <power-bodenrichtwert-detail [feature]="ft"></power-bodenrichtwert-detail>
      </div>
    </div>
  `,
  styles: []
})
export class BodenrichtwertListeComponent implements OnChanges {

  page = 1;
  pageSize = 2;

  @Input() features: FeatureCollection;

  @Input() stichtag;

  @Input() teilmarkt;

  @Output() selectionChange = new EventEmitter();

  filteredFeatures: Feature[];

  constructor(private bodenrichtwertService: BodenrichtwertService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredFeatures = this.features.features.filter(ft => ft.properties.stichtag === this.stichtag + 'Z');
  }

  selectFeature(feature: Feature) {
    this.selectionChange.emit(feature);
    this.bodenrichtwertService.updateSelected(feature);
  }

  get collectionSize() {
    return this.features.features.length;
  }
}
