#!/bin/bash

function green(){
    echo -e "\x1B[32m $1 \x1B[0m"
    if [ ! -z "${2}" ]; then
    echo -e "\x1B[32m $($2) \x1B[0m"
    fi
}
function install-on-mac-os-x() {
  green 'OS X detected'
  green 'Installing system dependent packages'

  brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
}

# This method uses apt-get as package manager, might not work on Fedora
function install-on-linux {
  green 'Linux distribution detected'
  green 'Installing system dependent packages (using apt-get)'

  sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
}

function main() {
    case "$OSTYPE" in
      darwin*)
        install-on-mac-os-x;;
      linux*) install-on-linux;;
      msys|cygwin)
        green 'Windows detected'
        green 'No system dependent packages needed'
        green 'Installing node dependencies'
        return;;
    esac

    echo System dependent packages installed
    echo Installing node dependencies
}

main