import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'power-bodenrichtwert-detail',
    templateUrl: './bodenrichtwert-detail.component.html',
    styleUrls: ['./bodenrichtwert-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodenrichtwertDetailComponent implements OnInit {

    brzStrings = {
        'brz': $localize`Bodenrichtwertzone`,
        'conversion': $localize`Umrechnung`,
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
        'grza': $localize`Grünlandzahl`
    };

    @Input() feature: any;

    ngOnInit() {
    }

    enutaBremen(feature) {
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
