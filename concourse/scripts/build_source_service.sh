#! /bin/bash
source concourse-repo/scripts/get_env_variable_and_properties.sh
cd git-branch/
echo "inside build source.sh"
set -e -u -x
java --version
./gradlew clean build