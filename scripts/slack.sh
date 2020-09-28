#!/bin/bash

if [[ "${CI_COMMIT_REF_NAME}" == "staging" ]]; then
	curl -s -X POST --data-urlencode "payload={\"channel\": \"#aks20-git-deployment\", \"username\": \"Deploybot\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":heavy_check_mark: Deploy to ${CI_COMMIT_REF_NAME}\"}}, {\"type\": \"divider\"}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"<https://gitlab.com/lgln/power.ni/power-frontend|power-frontend> with pipeline <https://gitlab.com/lgln/power.ni/power-frontend/-/pipelines/${CI_PIPELINE_ID}|${CI_PIPELINE_ID}> by ${GITLAB_USER_NAME} \n<https://gitlab.com/lgln/power.ni/power-frontend/-/commit/${CI_COMMIT_SHA}|${CI_COMMIT_TITLE}> \"}}], \"icon_emoji\": \":robot_face:\"}" "${SLACK_API}"
fi
