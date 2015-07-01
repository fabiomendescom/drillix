#!/bin/bash

echo "ZOOKEEPER servers being used: $DRX_ZOOKPRSVRS"
ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/MICRO_EVENTLOADER)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/MICRO_EVENTLOADER service folder"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/MICRO_EVENTLOADER eventloader
	echo "/DRILLIX/MICRO_EVENTLOADER service folder created"
fi

IPADDR=$(ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')

ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/MICRO_EVENTLOADER/$CONTAINERNAME)
if [ $ZOO ]; then
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/MICRO_EVENTLOADER/$CONTAINERNAME
fi
/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/MICRO_EVENTLOADER/$CONTAINERNAME $IPADDR:$PORTNUMBER
echo "$CONTAINERNAME with IP $IPADDR:$PORTNUMBER registered on /DRILLIX/MICRO_EVENTLOADER/$CONTAINERNAME on zookeeper"

cd /var/www

authbind node drillix_micro_eventloader.js 
