import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'flurstueckPipe'
})
export class FlurstueckPipe implements PipeTransform {

    transform(keyvaluearray: any, ...args: any[]): any {
        return keyvaluearray.map((t: { key, value }) => {
            return t.value.properties.wert;
        }).reduce((a, b) => a + b, 0);
    }

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
