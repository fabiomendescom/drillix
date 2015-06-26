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
sudo docker build -t drillix_storm .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -e "ZOOKEEPER_ADDR=$DRX_ZOOKPRSVRS" -p $2:6700 -p $3:6701 -p $4:6702 -p $5:6703 -p $6:3772 -p $7:8000 -p $8:8080 drillix_storm --daemon $9
sudo docker start $1
IPADDR=$(sudo docker inspect -f '{{ .NetworkSettings.IPAddress }}' $1)

echo "ZOOKEEPER servers being used: $DRX_ZOOKPRSVRS"
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/STORM)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/STORM service folder"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/STORM storm
	echo "/DRILLIX/STORM service folder created"
fi
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/STORM/$1)
if [ $ZOO ]; then
	zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/STORM/$1
fi
zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/STORM/$1 
echo "$1 with IP $IPADDR:$2 registered on /DRILLIX/STORM/$1 on zookeeper"

