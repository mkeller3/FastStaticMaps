FROM debian:bullseye-slim

ENV NODE_VERSION 16.18.1

RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

WORKDIR /app

# Note: this raises a deprecation warning for NodeJS 10
RUN set -ex \
  && apt-get update && apt-get install -y ca-certificates curl dirmngr xz-utils --no-install-recommends \
  && curl -fsSLO --compressed "https://nodejs.org/dist/latest-v16.x/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" \
  && apt-mark auto '.*' > /dev/null \
  && find /usr/local -type f -executable -exec ldd '{}' ';' \
  | awk '/=>/ { print $(NF-1) }' \
  | sort -u \
  | xargs -r dpkg-query --search \
  | cut -d: -f1 \
  | sort -u \
  | xargs -r apt-mark manual \
  && apt-get remove -y dirmngr xz-utils \
  # smoke tests
  && node --version \
  && npm --version

RUN DEBIAN_FRONTEND=noninteractive apt-get -y install \
  # note: curl added again here to prevent from autoremove
  curl \
  libuv1-dev \
  libcairo2-dev \
  libgles2-mesa-dev \
  libgbm-dev \
  libllvm11 \
  libprotobuf-dev \
  libxxf86vm-dev \
  xvfb \
  x11-utils

COPY package*.json /app/

RUN curl http://archive.ubuntu.com/ubuntu/pool/main/libj/libjpeg-turbo/libjpeg-turbo8_2.0.3-0ubuntu1_amd64.deb --output libjpeg-turbo8_2.0.3-0ubuntu1_amd64.deb && \
     curl http://archive.ubuntu.com/ubuntu/pool/main/i/icu/libicu66_66.1-2ubuntu2_amd64.deb --output libicu66_66.1-2ubuntu2_amd64.deb &&  \
     apt install ./libjpeg-turbo8_2.0.3-0ubuntu1_amd64.deb  && \
     apt install ./libicu66_66.1-2ubuntu2_amd64.deb

RUN npm ci && \
  rm -rf "/root/.npm" && \
  npm uninstall --no-save typescript eslint @babel/cli node-gyp && \
  npm prune --production && \
  rm -rf "/root/.npm" && \
  rm -rf "/root/.cache" && \
  # remove packages known not to be needed and cleanup apt cache
  apt-get autoremove -y && \
  apt-get remove -y libc6-dev && \
  rm -rf "/var/lib/apt/lists/*" && \
  # create local directory for tiles to prevent startup errors
  # if this is not defined via a bind point to host
  mkdir /app/tiles
RUN apt install  -y

EXPOSE 3000
ENV DISPLAY=:99

# Copy just the compiled code
COPY . /app/

COPY ./entrypoint.sh /root
RUN chmod +x /root/entrypoint.sh

ENTRYPOINT [ "/root/entrypoint.sh" ]