import { browser } from 'protractor';

import { AppPage } from './app.po';

describe('POWER-Frontend', () => {
    let page: AppPage;
    const PAGES = [
        '/',
        '/feedback',
        '/ogc-dienste',
        '/notfound',
        '/bodenrichtwerte',
        '/grundstuecksmarktberichte',
        '/landesgrundstuecksmarktberichte',
        '/immobilienpreisindex',
        '/forms'
    ];

    beforeEach(() => {
        page = new AppPage();
        browser.driver.manage().window().setSize(414, 736);
    });

    it('should display headline', () => {
        page.navigateTo('/');
        expect(page.getParagraphText()).toContain('Immobilienmarkt.NI');
    });

    it('should not scroll outside of viewport', async () => {
        let windowSize = await page.getWindowSize();

        // for all pages
        for (let pageUrl of PAGES) {
            page.navigateTo(pageUrl);
            let bodySize = await page.getBodyWidth();
            expect(bodySize.width).toBeLessThanOrEqual(windowSize.width);
        }
    });
});
