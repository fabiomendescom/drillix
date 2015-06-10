#!/bin/bash

if [ -z "$1" ]; then
	echo "You must have the container name as an argument"
	exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_redis .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -p 6379:6379 drillix_redis
sudo docker start $1
IPADDR=$(sudo docker inspect -f '{{ .NetworkSettings.IPAddress }}' $1)

ZOO=$(zookeepercli --servers localhost -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	zookeepercli --servers localhost -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(zookeepercli --servers localhost -c exists /DRILLIX/REDIS)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/REDIS service folder"
	zookeepercli --servers localhost -c create /DRILLIX/REDIS redis
	echo "/DRILLIX/REDIS service folder created"
fi
ZOO=$(zookeepercli --servers localhost -c exists /DRILLIX/REDIS/$1)
if [ $ZOO ]; then
	zookeepercli --servers localhost -c delete /DRILLIX/REDIS/$1
fi
zookeepercli --servers localhost -c create /DRILLIX/REDIS/$1 $IPADDR:6379
echo "$1 with IP $IPADDR:6379 registered on /DRILLIX/REDIS/$1 on zookeeper"
