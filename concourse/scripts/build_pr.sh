#! /bin/bash
source concourse-repo/scripts/get_env_variable_and_properties.sh
cd git-pull-request/
      echo "inside build pr.sh" 
      pwd
      set -e -u -x
      node --version
      npm --version
      npm install   # Install n globally
      npm run lint-fix
      npm run test
      npm run build:dev
