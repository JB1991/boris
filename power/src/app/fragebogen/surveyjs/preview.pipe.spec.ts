import { PreviewPipe } from './preview.pipe';

const sample = {
    locale: 'de',
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
    showPageTitles: false
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
/* vim: set expandtab ts=4 sw=4 sts=4: */
