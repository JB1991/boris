import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'verfahrensart'
})
export class VerfahrensartPipe implements PipeTransform {

    verg = {
        'San': $localize`Sanierungsgebiet`,
        'Entw': $localize`Entwicklungsbereich`,
        'SoSt': $localize`Soziale Stadt`,
        'StUb': $localize`Stadtumbau`
    };

    transform(value: any, ...args: any[]): any {
        return this.verg[value];
    }

}
