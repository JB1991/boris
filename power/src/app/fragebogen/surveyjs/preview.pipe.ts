import { Pipe, PipeTransform } from '@angular/core';

/**
 * Peview pipe wraps a single formular element into a minimal preview formular
 */
@Pipe({
    name: 'preview'
})
export class PreviewPipe implements PipeTransform {

    /**
     * Wraps a single formular element into a minimal preview formular
     * @param value formular element
     */
    transform(value: any): any {
        return {
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
