export const environment = {
    production: true,
    test: false,
    appName: 'POWER',
    ows: '/geoserver/boris/ows?',
    basemap: '/assets/boden/basemap.json',
    formAPI: '/formapi/',
    auth: {
        clientid: 'power',
        clientsecret: 'f53dc4b4-42fa-40bc-8ce3-63760a994b88',
        url: 'https://keycloak.power.niedersachsen.dev/auth/realms/power/protocol/openid-connect/',
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
            'feedback'
        ],
        localized: false,
        version: {
            version: 'local',
            branch: 'offline'
        }
    }
};
