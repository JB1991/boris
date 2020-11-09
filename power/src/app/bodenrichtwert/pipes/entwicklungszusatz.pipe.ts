import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'entwicklungszusatz'
})
export class EntwicklungszusatzPipe implements PipeTransform {

    entw = {
        'SU': $localize`Sanierungsbeeinflusster Bodenrichtwert, ohne Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
        'SB': $localize`Sanierungsbeeinflusster Bodenrichtwert, unter Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
        'EU': $localize`Entwicklungsbeeinflusster Bodenrichtwert, ohne Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`,
        'EB': $localize`Entwicklungsbeeinflusster Bodenrichtwert, unter Berücksichtigung der rechtlichen und tatsächlichen Neuordnung`
    };

    transform(value: any, ...args: any[]): any {
        return this.entw[value];
    }
}
