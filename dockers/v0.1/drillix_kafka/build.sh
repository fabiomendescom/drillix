#!/bin/bash
if [ -z "$DRX_ZOOKPRSVRS" ]; then
	echo "ENV variable DRX_ZOOKPRSVRS must be set (server1[:port1][,server2[:port2]...]"
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
sudo docker build -t drillix_kafka .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -e "ZOOKEEPER_IP=172.17.42.1" -e "ZOOKEEPER_PORT=2181" -p $2:9092 drillix_kafka
sudo docker start $1
IPADDR=$(sudo docker inspect -f '{{ .NetworkSettings.IPAddress }}' $1)

echo "ZOOKEEPER servers being used: $DRX_ZOOKPRSVRS"
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/KAFKA)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/KAFKA service folder"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/KAFKA kafka
	echo "/DRILLIX/KAFKA service folder created"
fi
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/KAFKA/$1)
if [ $ZOO ]; then
	zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/KAFKA/$1
fi
zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/KAFKA/$1 $IPADDR:$2
echo "$1 with IP $IPADDR:$2 registered on /DRILLIX/KAFKA/$1 on zookeeper"

