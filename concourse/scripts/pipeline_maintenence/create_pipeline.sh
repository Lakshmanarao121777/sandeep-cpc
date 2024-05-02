#! /bin/bash

# Set the token values from the supplied args (Repository and Version).
# Ex sh scripts/pipeline_maintenence/create_pipeline.sh jump 2.2.0
if [ $# -ne 2 ]; then
    echo "Illegal number of arguments"
    echo "Please use scripts/pipeline_maintenence/create_pipeline.sh <REPOSITORY> <VERSION>"
    exit 1
fi

REPOSITORY=$1
VERSION=$2

WBHOOK_VERSION=`echo "$VERSION" | sed -r 's/[.]+/_/g'`

sed -e "s/{{REPOSITORY}}/${REPOSITORY}/g" -e "s/{{VERSION}}/${VERSION}/g" -e "s/{{WBHOOK_VERSION}}/${WBHOOK_VERSION}/g" pipeline/template/jump-hosted-branch-pipeline-template.yml > pipeline/${REPOSITORY}-${VERSION}.yml

echo "Use the fly CLI to create pipeline in Concourse - team: common-payment.  Pipeline name should be set as <REPOSITORY>-<VERSION>."

