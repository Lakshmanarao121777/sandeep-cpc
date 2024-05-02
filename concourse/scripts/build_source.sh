#! /bin/bash
cd git-branch/
      echo "inside build source.sh"
      pwd
      set -e -u -x
      node --version
      npm --version
      npm install  # Install n globally
      npm run build:prod
