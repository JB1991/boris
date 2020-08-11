import { PreviewPipe } from './preview.pipe';

const sample = {
  locale: 'de',
  loadingHtml: 'Das Formular wird geladen <div class=\'spinner-border\' role=\'status\'></div>',
  completedHtml: 'Vielen Dank für das Abschließen von diesem Formular.',
  pages: [
    {
      elements: [
        { 'x': 3 }
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

describe('Fragebogen.Surveyjs.PreviewPipe', () => {
  it('create an instance', () => {
    const pip = new PreviewPipe();
    expect(pip).toBeTruthy();
  });

  it('transforms data', () => {
    const pip = new PreviewPipe();
    expect(pip.transform({ 'x': 3 })).toEqual(sample);
  });
});
