#!/bin/bash

if [ $# -ne 1 ] ; then
  echo  " USAGE: setup.sh <Full path to workspace root>"
  exit 1
fi

WORKSPACE_PATH=$1

HOSTED_DIR=hosted-method-of-payment
JUMP_DIR=jump
GLOBAL_DIR=global-web-resources

pushd $WORKSPACE_PATH/$HOSTED_DIR
npm run build:dev
popd

ln -s $WORKSPACE_PATH/$HOSTED_PATH/dist $HOSTED_DIR

pushd $WORKSPACE_PATH/$JUMP_DIR
npm run build:dev
popd

ln -s $WORKSPACE_PATH/$JUMP_DIR/dist $JUMP_DIR
ln -s $WORKSPACE_PATH/$GLOBAL_DIR $GLOBAL_DIR


