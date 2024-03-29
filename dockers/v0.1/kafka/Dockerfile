# Builds an image for Apache Kafka 0.8.1.1 from binary distribution.
#
# Runs on Oracle Java 7 and a base of Ubuntu 12.04, currently.
#
# TODO: This base image needs tags :-P
FROM relateiq/oracle-java7
MAINTAINER Ches Martin <ches@whiskeyandgrits.net>

RUN mkdir /kafka /data /logs

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates

#ENV KAFKA_RELEASE_ARCHIVE kafka_2.10-0.8.1.1.tgz
ENV KAFKA_RELEASE_ARCHIVE kafka_2.10-0.8.2.1.tgz

# Download Kafka binary distribution
#ADD http://www.trieuvan.com/apache/kafka/0.8.2.1/${KAFKA_RELEASE_ARCHIVE} /tmp/
#ADD https://dist.apache.org/repos/dist/release/kafka/0.8.2.1/${KAFKA_RELEASE_ARCHIVE}.md5 /tmp/

ADD https://archive.apache.org/dist/kafka/0.8.0/kafka_2.8.0-0.8.0.tar.gz
ADD https://archive.apache.org/dist/kafka/0.8.0/kafka_2.8.0-0.8.0.tar.gz.md5

WORKDIR /tmp

# Check artifact digest integrity
RUN echo VERIFY CHECKSUM: && \
  gpg --print-md MD5 ${KAFKA_RELEASE_ARCHIVE} 2>/dev/null && \
  cat ${KAFKA_RELEASE_ARCHIVE}.md5

# Install Kafka to /kafka
RUN tar -zx -C /kafka --strip-components=1 -f ${KAFKA_RELEASE_ARCHIVE} && \
  rm -rf kafka_*

ADD http://repo1.maven.org/maven2/org/slf4j/slf4j-log4j12/1.7.6/slf4j-log4j12-1.7.6.jar /kafka/libs/
ADD config /kafka/config

#Copy my start_drx.sh instead to the start.sh to apply my substitions. See my comments in it
ADD start_drx.sh /start.sh

ADD bootstrapper.sh /bootstrapper.sh
RUN chmod +x /bootstrapper.sh

WORKDIR /home/vagrant

RUN apt-get update
RUN apt-get -f install
RUN apt-get install -y wget
RUN wget -O /home/vagrant/zookeepercli https://github.com/outbrain/zookeepercli/releases/download/v1.0.10/zookeepercli
RUN chmod +x /home/vagrant/zookeepercli

RUN apt-get install -y net-tools 	 	

# Set up a user to run Kafka
RUN groupadd kafka && \
  useradd -d /kafka -g kafka -s /bin/false kafka && \
  chown -R kafka:kafka /kafka /data /logs
USER kafka
ENV PATH /kafka/bin:$PATH
WORKDIR /kafka

# primary, jmx
EXPOSE 9092 7203
VOLUME [ "/data", "/logs" ]

ENTRYPOINT ["/bootstrapper.sh"]
#CMD ["/start.sh"]

