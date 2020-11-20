import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bodenart'
})
export class BodenartPipe implements PipeTransform {

    bod = {
        'S': $localize`Sand`,
        'L': $localize`Lehm`,
        'LG': $localize`Lehm mit starkem Steingehalt`,
        'T': $localize`Ton`,
        'Mo': $localize`Moor`,
        'Fe': $localize`Felsen`,
        'IS': $localize`Lehmiger Sand`,
        'LMo': $localize`Lehm, Moor`,
        'ISg': $localize`Lehmiger Sand mit starkem Steingehalt`,
        'SI': $localize`Anlehmiger Sand`,
        'LT': $localize`Schwerer Lehm`,
        'ISMo': $localize`Lemiger Sand, Moor`,
        'St': $localize`Steine und Blöcke`,
        'MoL': $localize`Moor, Lehm`,
        'MoIS': $localize`Moor, Lehmiger Sand`,
        'MoS': $localize`Moor, Sand`,
        'MoT': $localize`Moor, Ton`,
    };

    transform(value: any, ...args: any[]): any {

        let res = '';

        if (value.includes(',')) {
            const bodenarten = value.split(',');
            bodenarten.forEach(bodenart => {
                res += this.bod[bodenart] + ' und ';
            });
            res = res.slice(0, res.length - 5);
        } else if (value.includes('/')) {
            const bodenarten = value.split('/');
            bodenarten.forEach(bodenart => {
                res += this.bod[bodenart] + ' auf ';
            });
            res = res.slice(0, res.length - 5);
        } else {
            res = this.bod[value];
        }

        return res;
    }
}
