#!/bin/sh
set -x # echo on
set -e

set -o allexport
. ./.env
set +o allexport

docker compose -f docker-compose.yml down
docker compose -f "docker-compose.yml" up -d --build 

set +x
set +e