import { Pipe, PipeTransform } from '@angular/core';

const entw = {
    'B': $localize`Baureifes Land`,
    'R': $localize`Rohbauland`,
    'E': $localize`Bauerwartungsland`,
    'LF': $localize`Fläche der Land- und Forstwirtschaft`,
    'SF': $localize`Sonstige Fläche`
};

@Pipe({
    name: 'entwicklungszustand'
})
export class EntwicklungszustandPipe implements PipeTransform {

    /** @inheritdoc */
    transform(value: keyof typeof entw): string {
        return entw[value];
    }
}
