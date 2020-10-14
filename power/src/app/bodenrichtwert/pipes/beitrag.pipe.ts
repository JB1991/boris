import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'beitrag'
})
export class BeitragPipe implements PipeTransform {

    beitrag = {
        '1': $localize`erschließungsbeitrags- und kostenerstattungsbetragsfrei`,
        '2': $localize`erschließungsbeitrags-/kostenerstattungsbetragsfrei und abgabenpflichtig nach Kommunalabgabengesetz`,
        '3': $localize`erschließungsbeitrags-/kostenerstattungsbetragspflichtig und abgabenpflichtig nach Kommunalabgabengesetz`,
    };

    transform(value: any, ...args: any[]): any {
        return this.beitrag[value];
    }

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
