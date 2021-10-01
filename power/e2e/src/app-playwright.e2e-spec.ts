/* eslint-disable max-lines */
import { test, expect } from '@playwright/test';

// Framework: https://playwright.dev/
// Ersten von Tests: npx playwright codegen --viewport-size \"1180, 720\" localhost:4200

// Zoom ist nicht immer identisch. URL dann nicht mit 'toBe' vergleichen, sondern mit 'toContain'

// const viewport_XL = 1280;
// const viewport_L = 1180;
// const viewport_M = 980;
// const viewport_S = 760;
// const viewport_XS = 300;

test.describe('Happy Path', () => {

    test('Smoke Test', async ({ page }) => {

        await page.goto('/');
        expect(await page.title()).toBe('Immobilienmarkt.NI');
    });

});
