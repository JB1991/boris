export const environment = {
    production: true,
    test: false,
    appName: 'POWER',
    baseurl: '',
    borisOws: '/geoserver/boris/ows?',
    alkisOws: '/geoserver/alkis/ows?',
    basemap: '/assets/boden/basemap.json',
    baviStyles: [
        'https://basisvisualisierung.niedersachsen.dev/styles/vt-style-classic.json',
        'https://basisvisualisierung.niedersachsen.dev/styles/vt-style-color.json',
        'https://dev.basisvisualisierung.niedersachsen.dev/styles/vt-style-light.json',
        'https://dev.basisvisualisierung.niedersachsen.dev/styles/vt-style-grayscale.json',
    ],
    formAPI: '/formapi/',
    auth: {
        clientid: 'power',
        clientsecret: 'PLACEHOLDER-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        url: 'https://immobilienmarkt.niedersachsen.de/iam/auth/realms/power/protocol/openid-connect/',
    },
    config: {
        // Hinweis: Beim aktivieren von Modulen auf Prod. diese URL bitte in der sitemap.xml hinzufügen
        modules: [
            'bodenrichtwerte',
            'immobilienpreisindex',
            'immobilienpreiskalkulator',
            'grundstuecksmarktberichte',
            'landesgrundstuecksmarktdaten',
            'landesgrundstuecksmarktberichte',
            'feedback',
            'ogc-dienste'
        ],
        localized: false,
        languages: [
            { short: 'de', name: 'Deutsch', url: '' },
            { short: 'de-simple', name: 'Einfache Sprache', url: '/de-simple' },
            { short: 'en', name: 'English', url: '/en' },
        ],
        version: {
            version: 'local',
            branch: 'offline'
        }
    }
};
