import { PlaywrightTestConfig, devices } from '@playwright/test';

// List of all devices: https://github.com/microsoft/playwright/blob/master/src/server/deviceDescriptorsSource.json
const config: PlaywrightTestConfig = {
    testDir: 'src',
    testMatch: '*playwright.e2e-spec.ts',
    retries: 0,
    use: {
        baseURL: 'http://localhost:4200',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'off'
    },
    projects: [
        {
            name: 'Chromium XL',
            use:
            {
                browserName: 'chromium',
                ...devices['Desktop Chrome']
            }
        },
        {
            name: 'Firefox L',
            use:
            {
                browserName: 'firefox',
                ...devices['iPad Pro 11 landscape'],
                isMobile: false
            }
        },
        {
            name: 'Safari M',
            use:
            {
                browserName: 'webkit',
                ...devices['iPad Mini']
            }
        },
        {
            name: 'Chromium S',
            use:
            {
                browserName: 'chromium',
                ...devices['iPhone 12 Pro Max']
            }
        },
        {
            name: 'Safari XS',
            use:
            {
                browserName: 'webkit',
                ...devices['iPhone SE']
            }
        }
    ]
};
export default config;
