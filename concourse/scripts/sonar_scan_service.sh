#! /bin/bash

set -o errexit -o nounset -o pipefail

echo "Inside sonar_scan_service.sh file"

source concourse-repo/scripts/get_env_variable_and_properties.sh

export ROOT_FOLDER=`pwd`

cd git-branch/
bash ./gradlew --info sonarqube