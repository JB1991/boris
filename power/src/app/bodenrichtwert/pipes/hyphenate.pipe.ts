import { Pipe, PipeTransform } from '@angular/core';
import { hyphenateHTMLSync } from 'hyphen/de';

@Pipe({
  name: 'hyphenate'
})
export class HyphenatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return hyphenateHTMLSync(value);
  }

}
