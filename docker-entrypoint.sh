#!/usr/bin/env sh
set -eu

envsubst '${GEOSERVER_URL} ${BKG_GEOCODING_SECRET}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
