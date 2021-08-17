import { Pipe, PipeTransform } from '@angular/core';

const verf = {
    'SU': $localize`Sanierungsunbeeinflusster Bodenrichtwert, ohne Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
    'SB': $localize`Sanierungsbeeinflusster Bodenrichtwert, unter Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
    'EU': $localize`Entwicklungsunbeeinflusster Bodenrichtwert, ohne Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
    'EB': $localize`Entwicklungsbeeinflusster Bodenrichtwert, unter Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`
};

@Pipe({
    name: 'entwicklungszusatz'
})
export class EntwicklungszusatzPipe implements PipeTransform {

    /** @inheritdoc */
    transform(value: keyof typeof verf): string {
        return verf[value];
    }
}
