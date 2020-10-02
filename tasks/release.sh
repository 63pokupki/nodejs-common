#!/usr/bin/bash

if [ ! $1 ]; then
    echo "Error: you should pass version number"
else
    echo "[@63pokupki/nodejs-common]: creating version"
    npm version $1

    echo "[@63pokupki/nodejs-common]: pushing updates"
    git push

    echo "[@63pokupki/nodejs-common]: publish updates"
    npm publish --access public --registry https://registry.npmjs.org
fi
