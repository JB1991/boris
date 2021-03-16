import { Component, Input, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';

@Component({
    selector: 'power-bodenrichtwert-detail',
    templateUrl: './bodenrichtwert-detail.component.html',
    styleUrls: ['./bodenrichtwert-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertDetailComponent implements OnInit, OnChanges {

    brzStrings = {
        'brz': $localize`Bodenrichtwertzone`,
        'umwert': $localize`Umrechnungstabelle`,
        'umdatei': $localize`Umrechnungsdatei`,
        'state': $localize`Beitragsabgabenrechtlicher Zustand`,
        'usage': $localize`Art der Nutzung`,
        'value': $localize`Bodenrichtwert`,
        'flae': $localize`Grundstücksfläche`,
        'gbrei': $localize`Grundstücksbreite`,
        'gtie': $localize`Grundstückstiefe`,
        'entw': $localize`Entwicklungszustand`,
        'stag': $localize`Stichtag`,
        'verf': $localize`Entwicklungs- und Sanierungszusatz`,
        'verg': $localize`Verfahrensgrund`,
        'bauw': $localize`Bauweise`,
        'bmz': $localize`Baumassenzahl`,
        'gez': $localize`Geschosszahl`,
        'grz': $localize`Grundflächenzahl`,
        'wgfz': $localize`Wertrelevante Geschossflächenzahl`,
        'acza': $localize`Ackerzahl`,
        'bod': $localize`Bodenart`,
        'grza': $localize`Grünlandzahl`,
        'frei': $localize`Landesspezifische Angaben`,
        'bem': $localize`Bemerkung`
    };

    @Input() stichtag: string;

    @Input() teilmarkt: any;

    @Input() features: FeatureCollection;

    public filteredFeatures: Feature[];

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.features || changes.stichtag || changes.teilmarkt) {
            this.filteredFeatures = this.features.features.filter(ft => ft.properties.stag === this.stichtag + 'Z');
        }
    }

    enutaBremen(feature: Feature) {
        if (feature.properties.nutzung[0].enuta[0] === 'G1' ||
            feature.properties.nutzung[0].enuta[0] === 'G2' ||
            feature.properties.nutzung[0].enuta[0] === 'G3' ||
            feature.properties.nutzung[0].enuta[0] === 'G4') {
            return true;
        }
        return false;
    }

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
