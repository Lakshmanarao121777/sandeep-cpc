#! /bin/bash
echo "inside build jump development.sh"
cd git-branch
pwd
set -e -u -x
node --version
npm --version
npm install  # Install n globally
npm run build:dev
cp -r dist/* ../jump
