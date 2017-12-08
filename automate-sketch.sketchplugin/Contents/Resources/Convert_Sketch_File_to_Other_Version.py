#!/usr/bin/python

import zipfile
import re
import os
import sys

sketchFile = os.path.join(os.getcwd(), sys.argv[1])
appVersion = sys.argv[2]
build = sys.argv[3]
version = sys.argv[4]
commit = sys.argv[5]
compatibilityVersion = sys.argv[6]

if zipfile.is_zipfile(sketchFile):

    archive = zipfile.ZipFile(sketchFile, 'r')
    meta = archive.read('meta.json')

    # change meta.json
    meta = re.sub(r'"commit":"[0-9a-f]{40}"', '"commit":"' + commit + '"', meta)
    meta = re.sub(r'"appVersion":"[0-9\.]*"', '"appVersion":"' + appVersion + '"', meta)
    meta = re.sub(r'"build":[0-9]{5,}', '"build":' + build, meta)
    meta = re.sub(r'"version":[0-9]{2,}', '"version":' + version, meta)
    meta = re.sub(r'"saveHistory":\["NONAPPSTORE\.[0-9]{5,}"\]', '"saveHistory":["NONAPPSTORE.' + build + '"]', meta)

    if appVersion >= 47:
        meta = re.sub(r'"compatibilityVersion":[0-9]{2,}', '"compatibilityVersion":' + compatibilityVersion, meta)

    # save a temp mate.json
    tmpFile = os.path.join(os.getcwd(), '.meta.json')
    with open(tmpFile, 'w') as file:
        file.write(meta)

    # create new sketch file
    convertedSketchFile = os.path.splitext(sketchFile)[0] + '_save_as_' + appVersion + os.path.splitext(sketchFile)[1]
    convertedArchive = zipfile.ZipFile(convertedSketchFile, 'w')

    # write temp meta.json to new sketch file
    convertedArchive.write(tmpFile, 'meta.json')
    os.remove(tmpFile)

    # move files inside old sketch file to new one
    for item in archive.infolist():
        if (item.filename != 'meta.json'):
            buffer = archive.read(item.filename)
            convertedArchive.writestr(item, buffer)
    convertedArchive.close()

    archive.close()

    print('Save to "' + convertedSketchFile + '".')

else:

    print('None a open format Sketch file. This is a file create with Sketch that under version 43.')
