import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'entwicklungszusatz'
})
export class EntwicklungszusatzPipe implements PipeTransform {

    verf = {
        'SU': $localize`Sanierungsunbeeinflusster Bodenrichtwert, ohne Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
        'SB': $localize`Sanierungsbeeinflusster Bodenrichtwert, unter Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
        'EU': $localize`Entwicklungsunbeeinflusster Bodenrichtwert, ohne Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
        'EB': $localize`Entwicklungsbeeinflusster Bodenrichtwert, unter Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`
    };

    /** @inheritdoc */
    transform(value: any, ...args: any[]): any {
        return this.verf[value];
    }
}
