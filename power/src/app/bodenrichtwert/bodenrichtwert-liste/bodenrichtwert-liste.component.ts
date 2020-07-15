import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { BodenrichtwertService } from '../bodenrichtwert.service';

@Component({
  selector: 'power-bodenrichtwert-liste',
  templateUrl: 'bodenrichtwert-liste.html',
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
    this.filteredFeatures = this.features.features.filter(ft => ft.properties.stag === this.stichtag + 'Z');
  }

  selectFeature(feature: Feature) {
    this.selectionChange.emit(feature);
    this.bodenrichtwertService.updateSelected(feature);
  }

  get collectionSize() {
    return this.features.features.length;
  }
}
