# Docker Image
Comcast Docker Hub: https://docker.hub.comcast.net/harbor/projects/503/repositories
## Build

```
docker build -t xia/concourse/cpc-service-box:1.0.0 .

```
## View

```
docker images
```
## Release

```
docker tag xia/concourse/cpc-service-box:1.0.0 hub.comcast.net/xia/concourse/cpc-service-box:1.0.0

docker tag hub.comcast.net/xia/concourse/cpc-service-box:1.0.0 hub.comcast.net/xia/concourse/cpc-service-box:latest

docker push hub.comcast.net/xia/concourse/cpc-service-box
```

## Download

```
docker pull hub.comcast.net/xia/concourse/smart-box:latest
```

## Login to docker hub
```
docker login hub.comcast.net    
```