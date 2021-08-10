import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'umlautCorrection'
})
export class UmlautCorrectionPipe implements PipeTransform {

    public corrections: Map<string, string> = new Map([
        ['Buero, hochw. Dienste', 'Büro, hochw. Dienste'],
        ['Handel, Geschaefte', 'Handel, Geschäfte'],
        ['Verbrauchermaerkte', 'Verbrauchermärkte'],
        ['Ã¤', 'ä'],
        ['Ã¶', 'ö'],
        ['Ã¼', 'ü'],
        ['ÃŸ', 'ß'],
        ['u.ae', 'u.ä'],
        ['usw', 'usw.']
    ]);

    /** @inheritdoc */
    transform(value: string): string {
        if (!value) {
            return '';
        }
        let result = value;

        for (const entry of this.corrections) {
            result = result.replace(entry[0], entry[1]);
        }
        return result;
    }
}
