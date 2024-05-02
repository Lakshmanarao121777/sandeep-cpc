#!/bin/bash

set -o errexit -o nounset -o pipefail

jq -r .commit code/.git/resource/version.json > commit-id/id
jq -r .pr code/.git/resource/version.json > pull-request-id/id

echo "commit id: $(cat commit-id/id)"
echo "PR id: $(cat pull-request-id/id)"