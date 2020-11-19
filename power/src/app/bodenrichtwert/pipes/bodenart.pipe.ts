import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bodenart'
})
export class BodenartPipe implements PipeTransform {

    bod = {
        'S': $localize`Sand`,
        'L': $localize`Lehm`,
        'T': $localize`Ton`,
        'Mo': $localize`Moor`,
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
