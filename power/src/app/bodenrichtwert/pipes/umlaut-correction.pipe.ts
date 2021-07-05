import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'umlautCorrection'
})
export class UmlautCorrectionPipe implements PipeTransform {

    corrections: Map<string, string> = new Map([
        ['Buero, hochw. Dienste', 'Büro, hochw. Dienste'],
        ['Handel, Geschaefte', 'Handel, Geschäfte'],
        ['Verbrauchermaerkte', 'Verbrauchermärkte'],
        ['QuakenbrÃ¼ck', 'Quakenbrück'],
        ['u.ae', 'u.ä'],
        ['usw', 'usw.']
    ]);

    transform(value: unknown, ...args: unknown[]): unknown {
        if (!value) {
            return '';
        }

        let result = value as string;

        for (const entry of this.corrections) {
            result = result.replace(entry[0], entry[1]);
        }

        return result;
    }
}
