#!/usr/bin/env sh
set -eu

envsubst '${BKG_GEOCODING_SECRET}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

su - nginx

exec "$@"
