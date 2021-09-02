import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';

/**
 * Peview pipe wraps a single formular element into a minimal preview formular
 */
@Pipe({
    name: 'preview'
})
export class PreviewPipe implements PipeTransform {

    constructor(@Inject(LOCALE_ID) public locale: string) { }

    /**
     * Wraps a single formular element into a minimal preview formular
     * @param value formular element
     * @param lang Language
     * @returns Surveyjs
     */
    public transform(value: any, lang = this.locale): any {
        return {
            locale: lang,
            pages: [
                {
                    elements: [
                        value
                    ],
                    name: 'p1'
                }
            ],
            showNavigationButtons: 'none',
            showQuestionNumbers: 'off',
            showTitle: false,
            showPageTitles: false
        };
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
