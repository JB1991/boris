import { Pipe, PipeTransform } from '@angular/core';

const beitrag = {
    '1': $localize`Erschließungsbeitrags- und kostenerstattungsbetragsfrei`,
    '2': $localize`Erschließungsbeitrags-/kostenerstattungsbetragsfrei und abgabenpflichtig nach Kommunalabgabengesetz`,
    '3': $localize`Erschließungsbeitrags-/kostenerstattungsbetragspflichtig und abgabenpflichtig nach Kommunalabgabengesetz`,
};

@Pipe({
    name: 'beitrag'
})
export class BeitragPipe implements PipeTransform {

    /** @inheritdoc */
    public transform(value: keyof typeof beitrag): string {
        return beitrag[value];
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
