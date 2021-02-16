FROM nginx:alpine

ARG BRANCH="local"
ARG COMMIT="dev"
LABEL branch=${BRANCH}
LABEL commit=${COMMIT}

COPY /power/dist/power /usr/share/nginx/html
COPY nginx-default.conf /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /

RUN mv /usr/share/nginx/html/de/* /usr/share/nginx/html/ \
    && rm -rf /usr/share/nginx/html/en/ \
    && echo "{\"version\":\"$COMMIT\",\"branch\":\"$BRANCH\"}" > /usr/share/nginx/html/assets/version.json

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
