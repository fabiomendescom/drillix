#https://github.com/jurmous/zookeeper-docker

# Hadoop image
FROM java:7
MAINTAINER jurmous

ENV USER root
ENV JAVA_HOME /usr/lib/jvm/java-1.7.0-openjdk-amd64

RUN mkdir -p /usr/local \
  && curl -s http://apache.cs.uu.nl/zookeeper/zookeeper-3.4.6/zookeeper-3.4.6.tar.gz | tar -xzf - -C /usr/local \
  && mv /usr/local/zookeeper-3.4.6 /usr/local/zookeeper \
  && mkdir -p /mnt/zookeeper

WORKDIR /usr/local/zookeeper

RUN apt-get install bash

ADD zoo.cfg.template /usr/local/zookeeper/conf/zoo.cfg.template

ADD bootstrap.sh /etc/bootstrap.sh
RUN chown root:root /etc/bootstrap.sh && chmod a+x /etc/bootstrap.sh

EXPOSE 2181 2888 3888

VOLUME ["/usr/local/zookeeper/conf", “/mnt/zookeeper"]

ENTRYPOINT ["/etc/bootstrap.sh"]
CMD ["/usr/local/zookeeper/bin/zkServer.sh","start-foreground"]
