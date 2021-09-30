#!/bin/sh
t=`date "+%Y%m%d%H%M%S"`
v=`git rev-parse --short HEAD`

name=$t

npm run build
docker build ./ -t hub.zenki.cn/fe/dataplus-template-fe:$name
docker push hub.zenki.cn/fe/dataplus-template-fe:$name
