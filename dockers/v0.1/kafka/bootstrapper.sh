#!/bin/bash

IPADDR=$(ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')

echo "ZOOKEEPER servers being used: $DRX_ZOOKPRSVRS"
ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi
ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/KAFKA)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/KAFKA service folder"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/KAFKA kafka
	echo "/DRILLIX/KAFKA service folder created"
fi
ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/KAFKA/$CONTAINERNAME)
if [ $ZOO ]; then
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/KAFKA/$CONTAINERNAME
fi
/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/KAFKA/$CONTAINERNAME $IPADDR:$PORTNUMBER
echo "$CONTAINERNAME with IP $IPADDR:$PORTNUMBER registered on /DRILLIX/KAFKA/$CONTAINERNAME on zookeeper"

/start.sh
