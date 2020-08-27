#!/bin/bash

if [[ "${CI_COMMIT_REF_NAME}" == "dev" ]]; then
	curl -X POST --data-urlencode "payload={\"channel\": \"#aks20-git-deployment\", \"username\": \"deploybot\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":white_check_mark: Deploy to ${CI_COMMIT_REF_NAME}\"}}, {\"type\": \"divider\"}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"<https://gitlab.com/lgln/power.ni/power-frontend|power-frontend> with pipeline <https://gitlab.com/lgln/power.ni/power-frontend/-/pipelines/${CI_PIPELINE_ID}|${CI_PIPELINE_ID}> by ${GITLAB_USER_NAME} \n<https://gitlab.com/lgln/power.ni/power-frontend/-/commit/${CI_COMMIT_SHA}|${CI_COMMIT_TITLE}> - ${CI_COMMIT_REF_NAME} \"}}], \"icon_emoji\": \":robot_face:\"}" https://hooks.slack.com/services/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
fi
