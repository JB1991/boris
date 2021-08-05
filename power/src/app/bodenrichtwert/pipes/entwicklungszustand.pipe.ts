import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'entwicklungszustand'
})
export class EntwicklungszustandPipe implements PipeTransform {

    entw = {
        'B': $localize`Baureifes Land`,
        'R': $localize`Rohbauland`,
        'E': $localize`Bauerwartungsland`,
        'LF': $localize`Fläche der Land- und Forstwirtschaft`,
        'SF': $localize`Sonstige Fläche`
    };

    /** @inheritdoc */
    transform(value: any, ...args: any[]): any {
        return this.entw[value];
    }
}
