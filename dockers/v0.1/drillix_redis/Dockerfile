FROM redis

RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D 114F43EE0176B71C7BC219DD50A3051F888C628D
ENV NODE_VERSION 0.8.28
ENV NPM_VERSION 2.9.1
RUN curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
&& curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
&& gpg --verify SHASUMS256.txt.asc \
&& grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
&& tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
&& rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
&& npm install -g npm@1.4.28 \	
&& npm install -g npm@"$NPM_VERSION" \
&& npm cache clear


#allow node user to run services on port 80 and 443 (when prefixed with 'authbind')
RUN \
  apt-get update && \
  apt-get install -y authbind && \
  rm -rf /var/lib/apt/lists/* && \
  touch /etc/authbind/byport/443 && \
  touch /etc/authbind/byport/80 && \
  chown -R node:node /etc/authbind/byport/ && \
  chmod -R 755 /etc/authbind/byport/ 
  
 
RUN mkdir -p /usr/local/redis

ADD drillix_redis.js /usr/local/rediszookeeper/drillix_redis.js

WORKDIR /usr/local/redis/

ENV NODE_DIR /usr/local/redis/
	 
CMD ["node", "drillix_redis.js"] 
	 
#ENTRYPOINT ["/entrypoint.sh"]
