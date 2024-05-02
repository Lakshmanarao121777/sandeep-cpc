#! /bin/bash

# Set the token values from the supplied args (Repository and Version).
# Ex sh scripts/pipeline_maintenence/remove_pipeline.sh jump 2.2.0
if [ $# -ne 2 ]; then
    echo "Illegal number of arguments"
    echo "Please use scripts/pipeline_maintenence/remove_pipeline.sh <REPOSITORY> <VERSION>"
    exit 1
fi

REPOSITORY=$1
VERSION=$2

rm pipeline/${REPOSITORY}-${VERSION}.yml

echo "Use the fly CLI to remove pipeline from Concourse - team: common-payment."