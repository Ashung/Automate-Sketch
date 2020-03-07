#!/usr/bin/env bash

app=Sketch.app

if [[ ${1} = "beta" ]]; then
    app="Sketch Beta.app"
fi

if [[ ${1} = "private" ]]; then
    app="Sketch Private.app"
fi

sketchtool="/Applications/${app}/Contents/Resources/sketchtool/bin/sketchtool"

if [ ! -f "${sketchtool}" ]; then
    echo 'xxx'
    exit
fi

version=$("${sketchtool}" -v | cut -d " " -f 3)

node make.js ${version}

"${sketchtool}" run automate-sketch.sketchplugin reload_plugins