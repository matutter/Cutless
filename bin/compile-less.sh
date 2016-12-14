#!/bin/bash
# compile_less.sh
# compiles all static/less*.less files into static/css/*.css files
# mixin files are skipped, they are only used as less reference imports.

BIN=$(dirname ${BASH_SOURCE[0]})
ROOT=$( readlink -f ${BIN}/.. )
SOURCE=$ROOT/dropnode

LESS=$SOURCE/static/less
CSS=$SOURCE/static/css

COMPILER=$(which lessc)

while read IN_FILE; do

  OUT_FILE=${IN_FILE/$LESS/$CSS}
  OUT_FILE=${OUT_FILE/'.less'/'.css'}
  echo "compiling $(basename ${IN_FILE})"

  $COMPILER $IN_FILE $OUT_FILE

done<<<"$(find $LESS -type f -name '*.less' | grep -v mixin)"