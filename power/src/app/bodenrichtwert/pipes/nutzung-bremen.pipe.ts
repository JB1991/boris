import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nutzungBremen'
})
export class NutzungBremenPipe implements PipeTransform {

    laenderspezifische_angabe = {
        'G1': $localize`Produktion, Spedition u.ä.`,
        'G2': $localize`Büro, hochw. Dienste usw.`,
        'G3': $localize`Handel, Geschäfte usw.`,
        'G4': $localize`Verbrauchermärkte u.ä.`
    };

    transform(value: any[], ...args: any[]): any {
        if (value === null) {
            return null;
        }

        let res = '';

        for (const nutzung of value) {
            if (nutzung['enuta'].length > 0) {
                if (nutzung['enuta'][0] === 'G1' || nutzung['enuta'][0] === 'G2' || nutzung['enuta'][0] === 'G3' || nutzung['enuta'][0] === 'G4') {
                    res += this.laenderspezifische_angabe[nutzung['enuta']];
                } else {
                    return null;
                };
            }
        }

        return res;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
