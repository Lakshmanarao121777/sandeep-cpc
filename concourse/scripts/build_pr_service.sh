#! /bin/bash
source concourse-repo/scripts/get_env_variable_and_properties.sh
cd git-pull-request/
echo "inside build_pr_service.sh"
set -e -u -x
java --version
./gradlew clean build 

cp build/libs/*.jar ../build/