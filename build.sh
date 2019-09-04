#!/bin/sh
# @todo add logic for "npm publish"
webpack --mode production
cp dist/index.html tutorials/index.html
cp dist/index.js tutorials/index.js
npm run jsdoc
npm publish --access=public