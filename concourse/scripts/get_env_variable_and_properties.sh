#! /bin/bash

set -o errexit -o nounset -o pipefail
mkdir -p /root/gradle_user_home/
export GRADLE_USER_HOME=/root/gradle_user_home/

cat <<EOF > $GRADLE_USER_HOME/gradle.properties
artifactory_url=${artifactory_url}
artifactory_user=${artifactory_user}
artifactory_password=${artifactory_password}
org.gradle.jvmargs=-Xms128m -Xmx1024m -XX:+CMSClassUnloadingEnabled
sonar_user=${sonar_login}
sonar_host_url=${sonar_host_url}
EOF

export SONAR_URL=${sonar_host_url}
export SONAR_USER=${sonar_login}

