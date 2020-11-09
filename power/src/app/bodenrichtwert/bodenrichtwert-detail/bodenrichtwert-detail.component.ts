import { Component, Input } from '@angular/core';

@Component({
    selector: 'power-bodenrichtwert-detail',
    templateUrl: './bodenrichtwert-detail.component.html',
    styleUrls: ['./bodenrichtwert-detail.component.css'],
})
export class BodenrichtwertDetailComponent {

    brzStrings = {
        'brz': $localize`Bodenrichtwertzone`,
        'state': $localize`Beitragsabgabenrechtlicher Zustand`,
        'usage': $localize`Art der Nutzung`,
        'value': $localize`Bodenrichtwert`,
        'flae': $localize`Grundstücksfläche`,
        'entw': $localize`Entwicklungszustand`,
        'stag': $localize`Stichtag`,
        'verf': $localize`Entwicklungs- und Sanierungszusatz`,
        'verg': $localize`Verfahrensgrund`
    };

    @Input() feature: any;

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
