#!/bin/bash
# compile_less.sh
# compiles all static/less*.less files into static/css/*.css files
# mixin files are skipped, they are only used as less reference imports.

BIN=$(dirname ${BASH_SOURCE[0]})
ROOT=$( readlink -f ${BIN}/.. )
SOURCE=$ROOT

LESS=$SOURCE/static/less
CSS=$SOURCE/static/css

COMPILER=$(which lessc)

if [ -z "$COMPILER" ]; then
  echo "Cannot find less transpiler (lessc)." 1>&2
  exit
fi

while read IN_FILE; do

  OUT_FILE=${IN_FILE/$LESS/$CSS}
  OUT_FILE=${OUT_FILE/'.less'/'.css'}

  if [ -f $OUT_FILE ]; then
    rm -f $OUT_FILE
  fi

  echo "$(basename ${IN_FILE}) > $(basename ${OUT_FILE})"
  $COMPILER $IN_FILE $OUT_FILE

done<<<"$(find $LESS -type f -name '*.less' | grep -v mixin)"
