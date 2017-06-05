#!/bin/bash
# compile_less.sh
# compiles all static/less*.less files into static/css/*.css files
# mixin files are skipped, they are only used as less reference imports.

m_root=$(readlink -f $(dirname $BASH_SOURCE)/..)
m_dir=$m_root/static/less
m_out=$m_root/static/css

echo "Checking $m_dir"

##
# Checks less @import directives to see if their modify time is newer then the file (arg1)
function has_newer_imports {
  m_src=$1

  while read less_import; do
    import_file=$(readlink -f "$m_dir/$less_import")
    if [ "$import_file" -nt "$m_dst" ]; then
      echo "> $m_src"
      echo ">> $import_file"
      return 0
    fi
  done<<<"$(cat $m_src | egrep '^@import' | cut -d '"' -f2)"
  
  return 1
}

##
# Checks a .less (and all .less imports) against the modify time of the output .css
# returns 0 (true) if newer, else 1 (false)
function is_newer {
  m_src=$1
  m_dst=$2
  
  if [ "$m_src" -nt "$m_dst" ]; then
    echo "> $m_src"
    return 0
  fi

  if has_newer_imports $m_src; then
    return 0
  fi
  
  return 1
}

function get_css_file {
  less_file=$1
  
  if [ ! -f "$less_file" ]; then echo "Invalid inpuut: $less_file" && exit; fi
  
  m_src_dir=$(dirname "$1")
  m_src_basename=$(basename "$1")
  m_src=$m_src_dir/$m_src_basename
  
  m_dst_dir=${m_src_dir/$m_dir/$m_out}
  m_dst_basename=${m_src_basename/.less/.css}
  m_dst=$m_dst_dir/$m_dst_basename

  echo "$m_dst"
}

find $m_dir -name *.less -not -path '*mixin/*' -print | while read less_file; do
  
  has_changed=false
  css_file=$(get_css_file $less_file)
  if is_newer $less_file $css_file; then has_changed=true; fi
  
  if $has_changed; then
    lessc $less_file $css_file
  fi

done
