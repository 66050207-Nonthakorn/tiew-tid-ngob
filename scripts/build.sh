#!/bin/sh

set -x # echo on
set -e # exit on error

pwd
ls

cd backend
# build image
docker build -t tiew-tid-ngob-backend .

cd ../cluster_backend
cd cluster_backend
# build image
docker build -t tiew-tid-ngob-cluster_backend .

set +x
set +e