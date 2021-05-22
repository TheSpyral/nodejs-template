#!/bin/bash
pm2 delete all

git fetch origin master && git reset --hard origin/master

yarn && yarn start