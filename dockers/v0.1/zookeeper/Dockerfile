FROM node:0.12
MAINTAINER Fabio Mendes (drillix)

RUN \
  npm install -g bower && \
  npm install -g forever && \
  npm install -g nodemon && \
  mkdir -p /var/www && \
  useradd -ms /sbin/nologin node && \
  chown -R node:node /var/www
	
#allow node user to run services on port 80 and 443 (when prefixed with 'authbind')
RUN \
  apt-get update && \
  apt-get install -y apt-utils && \
  apt-get install -y authbind && \
  rm -rf /var/lib/apt/lists/* && \
  touch /etc/authbind/byport/443 && \
  touch /etc/authbind/byport/80 && \
  chown -R node:node /etc/authbind/byport/ && \
  chmod -R 755 /etc/authbind/byport/ 
  

ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

RUN apt-get update && apt-get install -y openjdk-7-jre-headless wget

RUN wget -q -O - http://apache.mirrors.lucidnetworks.net/zookeeper/zookeeper-3.4.6/zookeeper-3.4.6.tar.gz | tar -xzf - -C /opt \
    && mv /opt/zookeeper-3.4.6 /opt/zookeeper \
    && cp /opt/zookeeper/conf/zoo_sample.cfg /opt/zookeeper/conf/zoo.cfg \
    && mkdir -p /tmp/zookeeper


#RUN wget -q -O - http://apache.mirrors.pair.com/zookeeper/zookeeper-3.3.4/zookeeper-3.3.4.tar.gz | tar -xzf - -C /opt \
#    && mv /opt/zookeeper-3.3.4 /opt/zookeeper \
#    && cp /opt/zookeeper/conf/zoo_sample.cfg /opt/zookeeper/conf/zoo.cfg \
#    && mkdir -p /tmp/zookeeper

EXPOSE 2181 2888 3888

WORKDIR /opt/zookeeper

ADD zoo.cfg /opt/zookeeper/conf/zoo.cfg

RUN mkdir -p /opt/zookeeper/workdir
VOLUME /opt/zookeeper/workdir

ENTRYPOINT ["/opt/zookeeper/bin/zkServer.sh"]

CMD ["start-foreground"] 

