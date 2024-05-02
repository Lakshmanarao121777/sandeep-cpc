#! /bin/bash
echo "inside build hosted method of payment development.sh"
cd git-branch
pwd
set -e -u -x
node --version
npm --version
npm install  # Install n globally
npm run build:dev
cp -r dist/* ../hosted-method-of-payment