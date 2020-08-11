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
      locale: 'de',
      loadingHtml: 'Das Formular wird geladen <div class=\'spinner-border\' role=\'status\'></div>',
      completedHtml: 'Vielen Dank für das Abschließen von diesem Formular.',
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
      showPageTitles: false,
      maxTextLength: 1000,
      maxOthersLength: 100,
    };
  }
}
