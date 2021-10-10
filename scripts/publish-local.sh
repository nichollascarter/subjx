#!/usr/bin/env bash

docker stop verdaccio
docker run -d --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
sleep 3

set -e

node ./scripts/npm-login.js
