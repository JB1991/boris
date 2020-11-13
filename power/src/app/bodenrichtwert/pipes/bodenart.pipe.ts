import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bodenart'
})
export class BodenartPipe implements PipeTransform {

    bod = {
        'S': $localize`Sand`,
        'SI': $localize`anlehmiger Sand`,
        'IS': $localize`lehmiger Sand`,
        'SL': $localize`stark lehmiger Sand`,
        'sL': $localize`sandiger Lehm`,
        'L': $localize`Lehm`,
        'LT': $localize`schwerer Lehm`,
        'T': $localize`Ton`,
        'Mo': $localize`Moor`,
    };

    transform(value: any, ...args: any[]): any {
        return this.bod[value];
    }
}
