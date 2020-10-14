import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'beitrag'
})
export class BeitragPipe implements PipeTransform {

    beitrag = {
        '1': $localize`Erschließungsbeitrags- und kostenerstattungsbetragsfrei`,
        '2': $localize`Erschließungsbeitrags-/kostenerstattungsbetragsfrei und abgabenpflichtig nach Kommunalabgabengesetz`,
        '3': $localize`Erschließungsbeitrags-/kostenerstattungsbetragspflichtig und abgabenpflichtig nach Kommunalabgabengesetz`,
    };

    transform(value: any, ...args: any[]): any {
        return this.beitrag[value];
    }

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
