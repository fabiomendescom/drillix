#!/bin/bash

echo "ZOOKEEPER servers being used: $DRX_ZOOKPRSVRS"
ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/REDIS)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/REDIS service folder"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/REDIS redis
	echo "/DRILLIX/REDIS service folder created"
fi

IPADDR=$(ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')

ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/REDIS/$CONTAINERNAME)
if [ $ZOO ]; then
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/REDIS/$CONTAINERNAME
fi
/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/REDIS/$CONTAINERNAME $IPADDR:$PORTNUMBER
echo "$CONTAINERNAME with IP $IPADDR:$PORTNUMBER registered on /DRILLIX/REDIS/$CONTAINERNAME on zookeeper"

redis-server 
#/usr/local/etc/redis/redis.conf
