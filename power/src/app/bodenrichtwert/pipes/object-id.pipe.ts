import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objectId'
})
export class ObjectIdPipe implements PipeTransform {

    /** @inheritdoc */
    transform(value: string, ...args: any[]): any {
        if (value === null) {
            return null;
        }

        return value.substr(6, value.length);
    }
}
