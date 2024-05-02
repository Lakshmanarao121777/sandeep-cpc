FROM alpine:3.14

ARG IMAGE_VERSION=1.0.2
ARG IMAGE_NAME=xia/concourse/cpc-service-box
ARG USER_HOME_DIR="/root"

LABEL vendor="XiA" \
      author="mshah510,ndrahn001" \
      version="${IMAGE_VERSION}" \
      description="This image is for use with Common Payment concourse jobs, providing git, java, and gradle support."

ENV DOCKER_IMAGE_NAME "${IMAGE_NAME}"
ENV DOCKER_IMAGE_VERSION "${IMAGE_VERSION}"

ENV GRADLE_USER_HOME=/root/gradle_user_home
ENV artifactory_url=https://artifactory.comcast.com/artifactory

RUN apk add --update openjdk11 ca-certificates openssl && update-ca-certificates
RUN apk add --no-cache curl tar bash procps git

RUN curl -L "https://packages.cloudfoundry.org/stable?release=linux64-binary&version=v8&source=github" | tar -zx
RUN mv cf8 /usr/local/bin

RUN mkdir -p /root/gradle_user_home/cache/

WORKDIR /home/`whoami`/gradle_user_home/cache

COPY . /root/gradle_user_home/cache

CMD ["/bin/bash"]
