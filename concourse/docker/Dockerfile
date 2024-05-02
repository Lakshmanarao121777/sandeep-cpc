FROM node:16-alpine

ARG IMAGE_VERSION=1.0.1
ARG IMAGE_NAME=xia/concourse/jump-box
ARG USER_HOME_DIR="/root"

LABEL vendor="XiA" \
      author="mshah510" \
      version="${IMAGE_VERSION}" \
      description="This image is for use with xia concourse jobs; providing git, python and npm support."

ENV DOCKER_IMAGE_NAME "${IMAGE_NAME}"
ENV DOCKER_IMAGE_VERSION "${IMAGE_VERSION}"

RUN apk add --update \
    python3 \
    python3-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

RUN apk add --update --no-cache \
		ca-certificates \
		curl \
		git \
		bash \
		openssl \
		zip \
		wget \
		jq \
	&& update-ca-certificates

RUN apk add --update openjdk11 ca-certificates openssl && update-ca-certificates
RUN curl -sL https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub -o /etc/apk/keys/sgerrand.rsa.pub
RUN curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-2.34-r0.apk
RUN curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-bin-2.34-r0.apk
RUN curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-i18n-2.34-r0.apk
RUN apk add --no-cache --force-overwrite glibc-2.34-r0.apk
RUN apk add --no-cache --force-overwrite glibc-bin-2.34-r0.apk
RUN apk add glibc-i18n-2.34-r0.apk

RUN mkdir -p /root/.sonar/native-sonar-scanner
RUN curl -s -L https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747-linux.zip -o sonarscanner.zip
RUN mv sonarscanner.zip /root/.sonar/native-sonar-scanner
RUN unzip /root/.sonar/native-sonar-scanner/sonarscanner.zip -d /root/.sonar/native-sonar-scanner

ARG GOLANG_VERSION=1.20.4
RUN apk update && apk add go gcc bash musl-dev openssl-dev ca-certificates && update-ca-certificates
RUN wget https://dl.google.com/go/go$GOLANG_VERSION.src.tar.gz && tar -C /usr/local -xzf go$GOLANG_VERSION.src.tar.gz
RUN cd /usr/local/go/src && ./make.bash
ENV PATH=$PATH:/usr/local/go/bin
RUN rm go$GOLANG_VERSION.src.tar.gz
RUN apk del go
RUN go version

RUN wget https://github.com/akamai/cli/releases/download/v1.5.5/akamai-v1.5.5-linux386
RUN chmod +x akamai-v1.5.5-linux386
RUN mv akamai-v1.5.5-linux386 /usr/bin/akamai
RUN ln -s /root/data/.edgerc /root/.edgerc
RUN apk add --no-cache --virtual .build-deps npm
RUN akamai install purge

RUN node --version

CMD ["/bin/bash"]