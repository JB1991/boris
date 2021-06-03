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
        clientsecret: 'f53dc4b4-42fa-40bc-8ce3-63760a994b88',
        url: 'https://iam.power.niedersachsen.dev/auth/realms/power/protocol/openid-connect/',
    },
    config: {
        modules: [
            'bodenrichtwerte',
            'immobilienpreisindex',
            'immobilienpreiskalkulator',
            'grundstuecksmarktberichte',
            'landesgrundstuecksmarktdaten',
            'landesgrundstuecksmarktberichte',
            'forms',
            'feedback',
            'ogc-dienste',
            'login',
            'logout'
        ],
        localized: true,
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
