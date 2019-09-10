#!/bin/sh
publish () {
  default="no"
  read -p "npm publish? (y/n) " answer
  : ${answer:=$default}

  if [ $answer = "y" ] || [ $answer = "Y" ] || [ $answer = "Yes" ] || [ $answer = "yes" ]; then
    npm publish --access=public
  fi
}

npm run unit:single && webpack --mode production && cp dist/index.html tutorials/index.html && cp dist/index.js tutorials/index.js && npm run jsdoc && publish

