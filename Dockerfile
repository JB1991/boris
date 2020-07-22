FROM nginx:alpine

COPY /power/dist/power /usr/share/nginx/html

ARG BRANCH="local"
ARG COMMIT="dev"
LABEL branch=${BRANCH}
LABEL commit=${COMMIT}
RUN echo "{\"version\":\"$COMMIT\",\"branch\":\"$BRANCH\"}" > /usr/share/nginx/html/assets/config/version.json

COPY nginx-default.conf.template /etc/nginx/conf.d/default.conf.template

COPY docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
