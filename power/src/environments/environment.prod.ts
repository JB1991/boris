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
        url: 'https://keycloak.power-cluster-65655d4c73bf47a3300821aa2939abf4-0001.eu-de.containers.appdomain.cloud/auth/realms/power/protocol/openid-connect/',
    }
};
