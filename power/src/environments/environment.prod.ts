export const environment = {
  production: true,
  test: false,
  appName: 'POWER',
  ows: '/geoserver/boris/ows?',
  basemap : 'https://vector-tiles-lgln.s3.ap.cloud-object-storage.appdomain.cloud/basemap.json',
  formAPI: '/formapi/',
  auth: {
    clientid: 'frontend',
    clientsecret: '4493f922-9f3e-416f-8891-91bd52300378',
    tokenurl: 'https://keycloak.power-cluster-65655d4c73bf47a3300821aa2939abf4-0001.eu-de.containers.appdomain.cloud/auth/realms/power/protocol/openid-connect/token',
    introspecturl: 'https://keycloak.power-cluster-65655d4c73bf47a3300821aa2939abf4-0001.eu-de.containers.appdomain.cloud/auth/realms/power/protocol/openid-connect/token/introspect'
  }
};
