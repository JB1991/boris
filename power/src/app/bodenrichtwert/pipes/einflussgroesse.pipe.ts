import { Pipe, PipeTransform } from '@angular/core';

const einflussgroesse = {
    'BEIT': $localize`Beitrags- und abgabenrechtlicher Zustand`,
    'NUTA': $localize`Art der Nutzung`,
    'BAUW': $localize`Bauweise`,
    'GEZ': $localize`Geschosszahl`,
    'WGFZ': $localize`Wertrelevante Geschossflächenzahl`,
    'GRZ': $localize`Grundflächenzahl`,
    'BMZ': $localize`Baumassenzahl`,
    'FLAE': $localize`Fläche in m²`,
    'GTIE': $localize`Tiefe`,
    'GBREI': $localize`Breite`,
    'ACZA': $localize`Ackerzahl`,
    'GRZA': $localize`Grünlandzahl`,
    'BOD': $localize`Bodenart`,
    'HINW': $localize`Hinweis`
};

@Pipe({
    name: 'einflussgroesse'
})
export class EinflussgroessePipe implements PipeTransform {

    /** @inheritdoc */
    transform(value: string): string {
        if (einflussgroesse.hasOwnProperty(value)) {
            return einflussgroesse[value as keyof typeof einflussgroesse];
        } else {
            return value;
        }
    }
}
