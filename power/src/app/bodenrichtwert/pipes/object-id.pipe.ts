import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objectId'
})
export class ObjectIdPipe implements PipeTransform {

    /** @inheritdoc */
    transform(value: string): string {
        if (value === null) {
            return '';
        }

        return value.substr(6, value.length);
    }
}
