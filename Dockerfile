FROM bitnami/nginx:latest

ARG BRANCH="local"
ARG COMMIT="dev"
LABEL branch=${BRANCH}
LABEL commit=${COMMIT}

USER root
COPY /power/dist/power/browser /app
COPY /chart/power/conf /opt/bitnami/nginx/conf/custom

RUN mv /app/de/* /app/ \
    && rm -rf /app/de/ \
    && echo "{\"version\":\"$COMMIT\",\"branch\":\"$BRANCH\"}" > /app/assets/version.json
USER 1001
