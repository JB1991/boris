import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';

@Component({
    selector: 'power-bodenrichtwert-liste',
    templateUrl: 'bodenrichtwert-liste.component.html',
    styleUrls: ['./bodenrichtwert-liste.component.scss'],
})
export class BodenrichtwertListeComponent implements OnChanges {

    @Input() features: FeatureCollection;

    @Input() stichtag;

    @Input() teilmarkt;

    filteredFeatures: Feature[];

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.filteredFeatures = this.features.features.filter(ft => ft.properties.stag === this.stichtag + 'Z');
    }

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
