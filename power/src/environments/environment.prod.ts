export const environment = {
    production: true,
    test: false,
    appName: 'POWER',
    ows: '/geoserver/boris/ows?',
    basemap: '/assets/boden/basemap.json',
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
            'ogc-services'
        ],
        localized: false,
        version: {
            version: 'local',
            branch: 'offline'
        }
    }
};
