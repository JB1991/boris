#!/usr/bin/env sh
set -eu

envsubst '${GEOSERVER_URL} ${BKG_GEOCODING_SECRET} ${FORMS_URL} ${WFS_BASIC_AUTH_SECRET}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
