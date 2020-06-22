import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beitrag'
})
export class BeitragPipe implements PipeTransform {

  beitrag = {
    '1': 'erschließungsbeitrags- und kostenerstattungsbetragsfrei',
    '2': 'erschließungsbeitrags-/kostenerstattungsbetragsfrei und abgabenpflichtig nach Kommunalabgabengesetz',
    '3': 'erschließungsbeitrags-/kostenerstattungsbetragspflichtig und abgabenpflichtig nach Kommunalabgabengesetz',
  };

  transform(value: any, ...args: unknown[]): unknown {
    return this.beitrag[value];
  }

}
