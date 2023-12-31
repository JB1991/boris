import { Pipe, PipeTransform } from '@angular/core';
import { hyphenateHTMLSync } from 'hyphen/de';

@Pipe({
    name: 'hyphenate'
})
export class HyphenatePipe implements PipeTransform {

    /** @inheritdoc */
    public transform(value: string): string {
        return hyphenateHTMLSync(value);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
