import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'einflussgroesse'
})
export class EinflussgroessePipe implements PipeTransform {

    einflussgroesse = {
        'BEIT': $localize`Beitrags- und abgabenrechtlicher Zustand`,
        'NUTA': $localize`Art der Nutzung`,
        'BAUW': $localize`Bauweise`,
        'GEZ': $localize`Geschosszahl`,
        'WGFZ': $localize`Wertrelevante Geschossflächenzahl`,
        'GRZ': $localize`Grundflächenzahl`,
        'BMZ': $localize`Baumassenzahl`,
        'FLAE': $localize`Fläche`,
        'GTIE': $localize`Tiefe`,
        'GBREI': $localize`Breite`,
        'ACZA': $localize`Ackerzahl`,
        'GRZA': $localize`Grünlandzahl`,
        'BOD': $localize`Bodenart`,
        'HINW': $localize`Hinweis`
    };

    transform(value: any, ...args: any[]): any {
        if (this.einflussgroesse.hasOwnProperty(value)) {
            return this.einflussgroesse[value];
        } else {
            return value;
        }
    }
}
