import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'umlautCorrection'
})
export class UmlautCorrectionPipe implements PipeTransform {

    corrections: Map<string, string> = new Map([
        ['Altwarmbuechen', 'Altwarmbüchen'],
        ['Doehren', 'Döhren'],
        ['Hans-Boeckler-Allee', 'Hans-Böckler-Allee'],
        ['Hoever', 'Höver'],
        ['Muehlenberg', 'Mühlenberg'],
        ['Muellingen', 'Müllingen'],
        ['QuakenbrÃ¼ck', 'Quakenbrück'],
        ['QuakenbrÃƒÂ¼ck', 'Quakenbrück'],
        ['Stoecken', 'Stöcken'],
        ['Sued', 'Süd'],
        ['Universitaet', 'Universität'],
        ['Wuelfel', 'Wülfel'],
        ['Wuelferode', 'Wülferode']
    ]);

    transform(value: unknown, ...args: unknown[]): unknown {
        if (!value) {
            return '';
        }

        let result = <string>value;

        for (const entry of this.corrections) {
            result = result.replace(entry[0], entry[1]);
        }

        return result;
    }
}
