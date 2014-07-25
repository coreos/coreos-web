#!/bin/bash -e

DEST=$1

function usage() {
    echo "usage: $0 <config-name> from .bumpcfg"
    exit 1
}

if [ -z $DEST ]; then
    usage
fi

source .bumpcfg
DIST_PATH=./dist/
DEST_PATH=${!DEST}

echo Running grunt...
grunt

echo "Copying assets from $DIST_PATH to $DEST_PATH"
cp -r $DIST_PATH $DEST_PATH
