#!/bin/bash

if [ -z "$DRILLIX_EVENTS_TOPICTOPUBLISH" ]; then
	echo "ENV variable DRILLIX_EVENTS_TOPICTOPUBLISH name must be set" 
	exit 1
fi
if [ -z "$DRILLIX_EVENTS_ENVPREFIX" ]; then
	echo "ENV variable DRILLIX_EVENTS_ENVPREFIX must be set"
	exit 1
fi 
if [ -z "$1" ]; then
	echo "You must have the container name as an argument"
	exit 1
fi
if [ -z "$2" ]; then
	echo "You must enter the port number as second argument"
	exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_micro_eventloader .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -e "ENVPREFIX=$DRILLIX_EVENTS_ENVPREFIX" -e "TOPICTOPUBLISH=$DRILLIX_EVENTS_TOPICTOPUBLISH" -p $2:9000 drillix_micro_eventloader
sudo docker start $1
IPADDR=$(sudo docker inspect -f '{{ .NetworkSettings.IPAddress }}' $1)

ZOO=$(zookeepercli --servers localhost -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	zookeepercli --servers localhost -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(zookeepercli --servers localhost -c exists /DRILLIX/MICRO_EVENTLOADER)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/MICRO_EVENTLOADER service folder"
	zookeepercli --servers localhost -c create /DRILLIX/MICRO_EVENTLOADER eventloader
	echo "/DRILLIX/MICRO_EVENTLOADER service folder created"
fi
ZOO=$(zookeepercli --servers localhost -c exists /DRILLIX/WORKER_LOADEVENTS/$1)
if [ $ZOO ]; then
	zookeepercli --servers localhost -c delete /DRILLIX/MICRO_EVENTLOADER/$1
fi
zookeepercli --servers localhost -c create /DRILLIX/MICRO_EVENTLOADER/$1 $IPADDR:$2
echo "$1 with IP $IPADDR:$2 registered on /DRILLIX/MICRO_EVENTLOADER/$1 on zookeeper"

