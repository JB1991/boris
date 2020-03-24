const packageJson = require('../../package.json');

export const environment = {
  production: true,
  test: false,
  appName: 'POWER',
  versions: {
    app: packageJson.version,
  },
  ows: '/geoserver/boris/ows?',
  basemap : 'https://vector-tiles-lgln.s3.ap.cloud-object-storage.appdomain.cloud/basemap.json',
  api_url: 'http://localhost:8080/'
};
