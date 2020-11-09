import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objectId'
})
export class ObjectIdPipe implements PipeTransform {

    transform(value: string, ...args: any[]): any {
        if (value === null) {
            return null;
        }

        return value.replace('DENIBR', '');
    }
}
