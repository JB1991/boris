import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo(page: string) {
        return browser.get(page);
    }

    getParagraphText() {
        return element(by.css('power-root strong')).getText();
    }

    /**
     * Returns size of window
     * @returns Object containing width and height
     */
    async getWindowSize() {
        return await browser.driver.manage().window().getSize();
    }

    /**
     * Returns width of body
     * @returns width of body
     */
    async getBodyWidth() {
        return await element(by.tagName('body')).getSize();
    }
}
