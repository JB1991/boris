import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bauweise'
})
export class BauweisePipe implements PipeTransform {

    bauw = {
        'o': $localize`offene Bauweise`,
        'g': $localize`geschlossene Bauweise`,
        'a': $localize`abweichende Bauweise`,
        'eh': $localize`Einzelhäuser`,
        'ed': $localize`Einzel- und Doppelhäuser`,
        'dh': $localize`Doppelhaushälften`,
        'rh': $localize`Reihenhäuser`,
        'rm': $localize`Reihenmittelhäuser`,
        're': $localize`Reihenendhäuser`,
    };

    transform(value: any, ...args: any[]): any {
        return this.bauw[value];
    }
}
