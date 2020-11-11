import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'artDerBebauung'
})
export class ArtDerBebauungPipe implements PipeTransform {

    art = {
        '1': $localize`EFH`,
        '2': $localize`MFH`
    };

    transform(value: any, ...args: any[]): any {
        return this.art[value];
    }
}
