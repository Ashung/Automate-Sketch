#!/usr/bin/env bash

version=$(/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool -v | cut -d ' ' -f 3)
sketchtool=/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool

node make.js ${version}

${sketchtool} run automate-sketch.sketchplugin reload_plugins