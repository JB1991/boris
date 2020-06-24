#!/bin/bash

docker run  --rm --name karma \
  -v "$PWD"/../power:/app \
  node:13 \
  power/node_modules/@angular/cli/bin/ng test --browsers ChromeHeadlessNoSandbox --progress false --watch false --code-coverage

#test:karma:
#  stage: test
#  image: node:13
#  before_script:
#    # Install chrome
#    - wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub |  apt-key add -
#    - echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' |  tee /etc/apt/sources.list.d/google-chrome.list
#    - apt-get update
#    - apt-get install google-chrome-stable -y
#  script:
#    # Run Karma tests
#    - cd power
#    - node_modules/@angular/cli/bin/ng test --browsers ChromeHeadlessNoSandbox --progress false --watch false --code-coverage
#  coverage: '/Lines \W+: (\d+\.\d+)%.*/'
#  artifacts:
#    reports:
#      junit: power/output/junit_karma.xml
#    paths:
#      - power/output/junit_karma.xml
#  only:
#    - merge_requests
#    - master
#
#test:e2e:
#  stage: test
#  image: node:13
#  before_script:
#    # Install chrome
#    - wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub |  apt-key add -
#    - echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' |  tee /etc/apt/sources.list.d/google-chrome.list
#    - apt-get update
#    - apt-get install google-chrome-stable -y
#  script:
#    # Run E2E tests
#    - cd power
#    - node_modules/@angular/cli/bin/ng e2e --protractor-config e2e/protractor-ci.conf.js
#  artifacts:
#    reports:
#      junit: power/output/junit_e2e.xml
#    paths:
#      - power/output/junit_e2e.xml
#  only:
#    - merge_requests
#    - master
#
#test:audit:
#  stage: test
#  image: node:13
#  allow_failure: true
#  script:
#    - cd power
#    - npm audit
#  only:
#    - merge_requests
#    - master
#
#test:lint:
#  stage: test
#  image: node:13
#  allow_failure: true
#  script:
#    - cd power
#    - npm run lint
#  only:
#    - merge_requests
#    - master
#
#test:lint:styles:
#  stage: test
#  image: node:13
#  allow_failure: true
#  script:
#    - cd power
#    - npm run lint:styles
#  only:
#    - merge_requests
#    - master