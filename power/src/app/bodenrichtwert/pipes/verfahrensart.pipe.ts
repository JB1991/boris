import { Pipe, PipeTransform } from '@angular/core';

const verg = {
    'San': $localize`Sanierungsgebiet`,
    'Entw': $localize`Entwicklungsbereich`,
    'SoSt': $localize`Soziale Stadt`,
    'StUb': $localize`Stadtumbau`
};

@Pipe({
    name: 'verfahrensart'
})
export class VerfahrensartPipe implements PipeTransform {

    /** @inheritdoc */
    transform(value: keyof typeof verg): string {
        return verg[value];
    }
}
