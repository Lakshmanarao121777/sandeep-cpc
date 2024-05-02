#! /bin/bash

echo "Inside sonar_scan.sh"

source concourse-repo/scripts/get_env_variable_and_properties.sh

cd git-branch/

pwd

set -e -u -x

node --version
npm --version

npm i sonarqube-scanner

npm run sonar