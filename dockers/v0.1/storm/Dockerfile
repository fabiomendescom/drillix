FROM ubuntu:latest
MAINTAINER Fabio Mendes

RUN apt-get update
RUN apt-get upgrade -y

# Install Oracle JDK 6 and others useful packages
#RUN apt-get install -y python-software-properties software-properties-common
#RUN add-apt-repository -y ppa:webupd8team/java
#RUN apt-get update
# Accept the Oracle license before the installation
#RUN echo oracle-java6-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections 
#RUN apt-get install -y oracle-java6-installer
#RUN apt-get update

# Install Oracle JDK 7 and others useful packages
RUN apt-get install -y python-software-properties software-properties-common
RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
# Accept the Oracle license before the installation
RUN echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections 
RUN apt-get install -y oracle-java7-installer
RUN apt-get update

# Tells Supervisor to run interactively rather than daemonize
RUN apt-get install -y supervisor wget tar 
RUN echo [supervisord] | tee -a /etc/supervisor/supervisord.conf ; echo nodaemon=true | tee -a /etc/supervisor/supervisord.conf ; echo loglevel=debug | tee -a /etc/supervisor/supervisord.conf

#Install Node
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get install -y python-software-properties python g++ make
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
#RUN apt-get install -y nodejs
#RUN npm install --save node-storm
#RUN npm install --save kafka-node
#RUN npm install cassandra-driver
#RUN npm install kafka0.8

#ENV STORM_VERSION 0.9.5
ENV STORM_VERSION 0.9.5

# Create storm group and user
ENV STORM_HOME /usr/share/apache-storm 

RUN groupadd storm; useradd --gid storm --home-dir /home/storm --create-home --shell /bin/bash storm

# Download and Install Apache Storm
#RUN wget http://apache.mirrors.ovh.net/ftp.apache.org/dist/storm/apache-storm-$STORM_VERSION/apache-storm-$STORM_VERSION.tar.gz && \
RUN wget http://mirror.metrocast.net/apache/storm/apache-storm-$STORM_VERSION/apache-storm-$STORM_VERSION.tar.gz && \
tar -xzvf apache-storm-$STORM_VERSION.tar.gz -C /usr/share && mv $STORM_HOME-$STORM_VERSION $STORM_HOME && \
rm -rf apache-storm-$STORM_VERSION.tar.gz


RUN mkdir /var/log/storm ; chown -R storm:storm /var/log/storm ; ln -s /var/log/storm /home/storm/log
RUN ln -s $STORM_HOME/bin/storm /usr/bin/storm
ADD conf/cluster.xml $STORM_HOME/logback/cluster.xml
ADD conf/storm.yaml.nimbus.template $STORM_HOME/conf/storm.yaml.nimbus.template
ADD conf/storm.yaml.supervisor.template $STORM_HOME/conf/storm.yaml.supervisor.template

# Add scripts required to run storm daemons under supervision
ADD script/entrypoint_drx.sh /home/storm/entrypoint.sh
ADD supervisor/storm-daemon.conf /home/storm/storm-daemon.conf

RUN chown -R storm:storm $STORM_HOME && chmod u+x /home/storm/entrypoint.sh

#ADD nimbustopology.js /home/storm/nimbustopology.js

EXPOSE 8080 6627 3773 3772 6700 6701 6702 6703 8000


RUN wget -O /home/storm/zookeepercli https://github.com/outbrain/zookeepercli/releases/download/v1.0.10/zookeepercli
RUN chmod +x /home/storm/zookeepercli

COPY kstorm-1.0-SNAPSHOT-jar-with-dependencies.jar /home/storm/kstorm-1.0-SNAPSHOT-jar-with-dependencies.jar

# Add VOLUMEs to allow backup of config and logs
# VOLUME ["/usr/share/apache-storm/conf","/var/log/storm"]

WORKDIR /home/storm


ENTRYPOINT ["/bin/bash", "/home/storm/entrypoint.sh"]

