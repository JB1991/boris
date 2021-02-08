import { AppPage } from './app.po';

describe('POWER-Frontend', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display headline', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toContain('Immobilienmarkt.NI');
    });
});
