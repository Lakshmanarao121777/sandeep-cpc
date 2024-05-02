#! /bin/bash
cd git-branch/
echo "inside build_branch.sh for $environment environment."
pwd
set -e -u -x
node --version
npm --version
npm install  # Install n globally
npm run build:$environment
cp -r dist/* ../$output_folder