// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    test: true,
    appName: 'POWER',
    ows: '/geoserver/boris/ows?',
    basemap: '/assets/boden/basemap.json',
    formAPI: 'http://localhost:8080/rest/api/',
    auth: {
        clientid: 'power',
        clientsecret: 'f53dc4b4-42fa-40bc-8ce3-63760a994b88',
        url: 'https://keycloak.power.niedersachsen.dev/auth/realms/power/protocol/openid-connect/',
    }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
