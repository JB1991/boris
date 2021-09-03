import { Pipe, PipeTransform } from '@angular/core';

const bauw = {
    'o': $localize`offene Bauweise`,
    'g': $localize`geschlossene Bauweise`,
    'a': $localize`abweichende Bauweise`,
    'eh': $localize`Einzelhäuser`,
    'ed': $localize`Einzel- und Doppelhäuser`,
    'dh': $localize`Doppelhaushälften`,
    'rh': $localize`Reihenhäuser`,
    'rm': $localize`Reihenmittelhäuser`,
    're': $localize`Reihenendhäuser`
};

@Pipe({
    name: 'bauweise'
})
export class BauweisePipe implements PipeTransform {

    /** @inheritdoc */
    public transform(value: keyof typeof bauw): string {
        return bauw[value];
    }
}
