#!/bin/bash -x

# THIS FILE IS THE start.sh FILE MODIFIED BY ME AND RENAMED IT TO drx_start.sh
# IT WAS DONE THIS WAY BECAUSE IF WE INSTALL THIS AGAIN, THE FILE WILL NOT BE OVERRIDEN
# LINE: | sed "s|{{ZOOKEEPER_IP}}:{{ZOOKEEPER_PORT}}|${DRX_ZOOKPRSVRS}|g" \
# WAS CREATED AND SUBSEQUENT LINES WITH ZOOKEEPER_PORT REMOVED

# If a ZooKeeper container is linked with the alias `zookeeper`, use it.
# TODO Service discovery otherwise
#[ -n "$ZOOKEEPER_PORT_2181_TCP_ADDR" ] && ZOOKEEPER_IP=$ZOOKEEPER_PORT_2181_TCP_ADDR
#[ -n "$ZOOKEEPER_PORT_2181_TCP_PORT" ] && ZOOKEEPER_PORT=$ZOOKEEPER_PORT_2181_TCP_PORT

EXTENSION=".default"

IP=$(ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')

PORT=9092

cat /kafka/config/server.properties${EXTENSION} \
  | sed "s|{{ZOOKEEPER_SERVERS}}|${DRX_ZOOKPRSVRS}|g" \
  | sed "s|{{BROKER_ID}}|${BROKER_ID:-0}|g" \
  | sed "s|{{CHROOT}}|${ZKROOT:-}|g" \
  | sed "s|{{EXPOSED_HOST}}|${EXPOSED_HOST:-$IP}|g" \
  | sed "s|{{PORT}}|${PORTNUMBER:-9092}|g" \
  | sed "s|{{EXPOSED_PORT}}|${PORTNUMBER:-9092}|g" \
   > /kafka/config/server.properties
   
cat /kafka/config/server.properties   
   

export CLASSPATH=$CLASSPATH:/kafka/lib/slf4j-log4j12.jar
export JMX_PORT=7203

echo "Starting kafka"
exec /kafka/bin/kafka-server-start.sh /kafka/config/server.properties
