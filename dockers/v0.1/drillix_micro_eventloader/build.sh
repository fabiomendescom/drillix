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
sudo docker build -t drillix_micro_eventloader .   
sudo docker kill $1 
sudo docker rm $1 
#sudo docker create --name="$1" -e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" -e "DRX_AGRP_AWSACCKEY=$DRX_AGRP_AWSACCKEY" -e "DRX_AGRP_AWSSECKEY=$DRX_AGRP_AWSSECKEY" -e "DRX_AGRP_AWSREGION=$DRX_AGRP_AWSREGION" -e "DRX_AGRP_AWSACCNT=$DRX_AGRP_AWSACCNT" -e "DRX_AGRP_DYNAMOTBL=$DRX_AGRP_DYNAMOTBL" -p $3:9000 drillix_micro_eventloader
sudo docker create --name="$1" -e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" -p $2:9000 drillix_micro_eventloader
sudo docker start $1
IPADDR=$(sudo docker inspect -f '{{ .NetworkSettings.IPAddress }}' $1)

echo "ZOOKEEPER servers being used: $DRX_ZOOKPRSVRS"
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/MICRO_EVENTLOADER)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/MICRO_EVENTLOADER service folder"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/MICRO_EVENTLOADER eventloader
	echo "/DRILLIX/MICRO_EVENTLOADER service folder created"
fi
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/MICRO_EVENTLOADER/$1)
if [ $ZOO ]; then
	zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/MICRO_EVENTLOADER/$1
fi
zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/MICRO_EVENTLOADER/$1 $IPADDR:$2
echo "$1 with IP $IPADDR:$2 registered on /DRILLIX/MICRO_EVENTLOADER/$1 on zookeeper"

