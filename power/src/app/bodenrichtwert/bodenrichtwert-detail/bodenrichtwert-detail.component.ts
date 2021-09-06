import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Teilmarkt } from '../bodenrichtwert-component/bodenrichtwert.component';

@Component({
    selector: 'power-bodenrichtwert-detail',
    templateUrl: './bodenrichtwert-detail.component.html',
    styleUrls: ['./bodenrichtwert-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertDetailComponent implements OnChanges {

    @Input() public stichtag?: string;

    @Input() public teilmarkt?: Teilmarkt;

    @Input() public features?: FeatureCollection;

    public readonly brzStrings = {
        'brz': $localize`Bodenrichtwertzone`,
        'umwert': $localize`Umrechnungstabelle`,
        'umdatei': $localize`Umrechnungsdatei`,
        'state': $localize`Beitrags- und abgabenrechtlicher Zustand`,
        'usage': $localize`Art der Nutzung`,
        'value': $localize`Bodenrichtwert`,
        'flae': {
            'header': $localize`Grundstücksfläche`,
            'tooltip': $localize`Fläche des Richtwertgrundstücks`
        },
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

    public filteredFeatures?: Feature[];

    /* istanbul ignore next */
    /** @inheritdoc */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['features'] || changes['stichtag'] || changes['teilmarkt']) {
            this.filteredFeatures = this.features?.features.filter((ft) => ft.properties?.['stag'] === this.stichtag + 'Z').sort((i, j) => i.properties?.['brw'] - j.properties?.['brw']);
        }
    }

    /**
     * rewriteUmrechnungstabURL rewrites the url of the boris alt umrechnungstabellen/dateien
     * @param url url of boris alt
     * @returns rewritedURL for the new location
     */
    public rewriteUmrechnungstabURL(url: string): string {
        const path = url.replace('http://boris.niedersachsen.de', '');
        return location.protocol + '//' + location.host + '/boris-umdatei' + path.substr(0, path.lastIndexOf('.')) + '.pdf';
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
