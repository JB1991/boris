import { PlaywrightTestConfig, devices } from '@playwright/test';

// List of all devices: https://github.com/microsoft/playwright/blob/master/src/server/deviceDescriptorsSource.json
const config: PlaywrightTestConfig = {
    testDir: 'src',
    testMatch: '*playwright.e2e-spec.ts',
    retries: 1,
    use: {
        baseURL: 'https://dev.power.niedersachsen.dev',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retry-with-video'
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
            name: 'Firefox XL',
            use:
            {
                browserName: 'firefox',
                ...devices['Desktop Firefox']
            }
        },
        {
            name: 'Safari XL',
            use:
            {
                browserName: 'webkit',
                ...devices['Desktop Safari']
            }
        },


        {
            name: 'Chromium L',
            use:
            {
                browserName: 'chromium',
                ...devices['iPad Pro 11 landscape']
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
            name: 'Safari L',
            use:
            {
                browserName: 'webkit',
                ...devices['iPad Pro 11 landscape']
            }
        },


        {
            name: 'Chromium M',
            use:
            {
                browserName: 'chromium',
                ...devices['iPad Mini']
            }
        },
        {
            name: 'Firefox M',
            use:
            {
                browserName: 'firefox',
                ...devices['iPad Mini'],
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
            name: 'Firefox S',
            use:
            {
                browserName: 'firefox',
                ...devices['iPhone 12 Pro Max'],
                isMobile: false
            }
        },
        {
            name: 'Safari S',
            use:
            {
                browserName: 'webkit',
                ...devices['iPhone 12 Pro Max']
            }
        },


        {
            name: 'Chromium XS',
            use:
            {
                browserName: 'chromium',
                ...devices['Galaxy S9+']
            }
        },
        {
            name: 'Firefox XS',
            use:
            {
                browserName: 'firefox',
                ...devices['Galaxy S9+'],
                isMobile: false
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
