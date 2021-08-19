import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Svg Pipe allows inserting svg html into web page
 */
@Pipe({
    name: 'svg'
})
export class SvgPipe implements PipeTransform {

    constructor(private sanitized: DomSanitizer) { }

    /**
     * Svg Pipe allows inserting svg html into web page
     * @param value formular element
     * @returns Trusted html
     */
    transform(value: string): SafeHtml {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
