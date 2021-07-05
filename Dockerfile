FROM bitnami/nginx:latest

ARG BRANCH="local"
ARG COMMIT="dev"
LABEL branch=${BRANCH}
LABEL commit=${COMMIT}

USER root
COPY /power/dist/power/browser /app
COPY /nginx/nginx.conf /opt/bitnami/nginx/conf/nginx.conf
COPY /nginx/server /opt/bitnami/nginx/conf/server_blocks
COPY /nginx/custom /opt/bitnami/nginx/conf/custom

RUN mv /app/de/* /app/ \
    && rm -rf /app/de/ \
    && echo "{\"version\":\"$COMMIT\",\"branch\":\"$BRANCH\"}" > /app/assets/version.json
USER 1001

EXPOSE 8080 8081 8443
