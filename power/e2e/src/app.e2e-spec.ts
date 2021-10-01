/* eslint-disable max-lines */
import { test, expect } from '@playwright/test';

test.describe('Happy Path', () => {

    test('Smoke Test', async ({ page }) => {
        await page.goto('/');

        // check title
        expect(await page.title()).toBe('Immobilienmarkt.NI');
    });

    test('Seite: Start', async ({ page }) => {
        // Go to /
        await page.goto('/');

        // carousel
        await page.click('a[role="button"]:has-text("Next")');
        await page.click('text=Einblicke in den Grundstücksmarkt und der Entwicklung des Preisniveau der einzel');
        await page.click('text=GrundstücksmarktberichteEinblicke in den Grundstücksmarkt und der Entwicklung de >> a[role="button"]');

        // check text
        await page.click('text=Grundstücksmarktberichte geben einen fundierten Einblick in das Geschehen am');
    });

    test('Seite: Feedback', async ({ page, viewport, baseURL }) => {
        // Go to /
        await page.goto('/');

        // mobile devices
        if (viewport && viewport.width < 992) {
            await page.click('xpath=/html/body/power-root/div/nav/button');
        }

        // Click text=Feedback
        await page.click('text=Feedback');
        await expect(page).toHaveURL(baseURL + '/feedback');

        // Click text=Bitte schauen Sie in der Feedbackübersicht, ob Ihr Anliegen uns bereits geschick
        await page.click('text=Bitte schauen Sie in der Feedbackübersicht, ob Ihr Anliegen uns bereits geschick');

        // Click text=incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com
        await page.click('text=incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com');
    });

    test('Seite: OGC Dienste', async ({ page, baseURL }) => {
        // Go to /
        await page.goto('/');

        // Click #ogc-dienste >> text=OGC Dienste
        await page.click('#ogc-dienste >> text=OGC Dienste');
        await expect(page).toHaveURL(baseURL + '/ogc-dienste');

        // Click text=Technischer Support
        await page.click('text=Technischer Support');

        // Click button:has-text("WMS (Version 1.1 und 1.3)")
        await page.click('button:has-text("WMS (Version 1.1 und 1.3)")');

        // Click text=https://www.geobasisdaten.niedersachsen.de/doorman/noauth/WMS_boris?VERSION=1.3.
        await page.click('text=https://www.geobasisdaten.niedersachsen.de/doorman/noauth/WMS_boris?VERSION=1.3.');

        // Click button:has-text("WFS (Version 1.0.0, 1.1.0 und 2.0.0)")
        await page.click('button:has-text("WFS (Version 1.0.0, 1.1.0 und 2.0.0)")');

        // Click text=https://www.geobasisdaten.niedersachsen.de/doorman/noauth/WFS_boris_2012
        await page.click('text=https://www.geobasisdaten.niedersachsen.de/doorman/noauth/WFS_boris_2012');
    });

    test('Seite: Not Found', async ({ page, baseURL }) => {
        // Go to /
        await page.goto('/xxx');
        await expect(page).toHaveURL(baseURL + '/notfound');

        // check text
        await page.click('text=Seite nicht gefunden');
    });

    test('Seite: Impressum', async ({ page, baseURL }) => {
        // Go to /
        await page.goto('/');

        // Click text=Impressum
        await page.click('text=Impressum');
        await expect(page).toHaveURL(baseURL + '/impressum');

        // Click text=Haftungsausschluss
        await page.click('text=Haftungsausschluss');
    });

    test('Seite: Datenschutz', async ({ page, baseURL }) => {
        // Go to /
        await page.goto('/');

        // Click text=Datenschutz
        await page.click('text=Datenschutz');
        await expect(page).toHaveURL(baseURL + '/datenschutz');

        // Click text=Andreas Christ
        await page.click('text=Andreas Christ');
    });

    test('Seite: Nutzungsbedingungen', async ({ page, baseURL }) => {
        // Go to /
        await page.goto('/');

        // Click text=Nutzungsbedingungen
        await page.click('text=Nutzungsbedingungen');
        await expect(page).toHaveURL(baseURL + '/nutzungsbedingungen');

        // Click text=(5) Haftung
        await page.click('text=(5) Haftung');
    });

    test('Seite: Barrierefreiheit', async ({ page, baseURL }) => {
        // Go to /
        await page.goto('/');

        // Click text=Barrierefreiheit
        await page.click('text=Barrierefreiheit');
        await expect(page).toHaveURL(baseURL + '/barrierefreiheit');

        // Click text=Feedback und Kontaktangaben
        await page.click('text=Feedback und Kontaktangaben');
    });

});
