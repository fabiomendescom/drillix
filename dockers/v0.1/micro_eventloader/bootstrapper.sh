#!/bin/bash

ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/MICROSERVICES)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/MICROSERVICES service folder"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/MICROSERVICES microservices
	echo "/DRILLIX/MICROSERVICES service folder created"
fi

ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/MICROSERVICES/EVENTLOADER)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/MICROSERVICES/EVENTLOADER service folder"
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/MICROSERVICES/EVENTLOADER eventloader
	echo "/DRILLIX/MICROSERVICES/EVENTLOADER service folder created"
fi

IPADDR=$(ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')

ZOO=$(/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/MICROSERVICES/EVENTLOADER/$CONTAINERNAME)
if [ $ZOO ]; then
	/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/MICROSERVICES/EVENTLOADER/$CONTAINERNAME
fi
/home/vagrant/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/MICROSERVICES/EVENTLOADER/$CONTAINERNAME $IPADDR:$PORTNUMBER
echo "$CONTAINERNAME with IP $IPADDR:$PORTNUMBER registered on /DRILLIX/MICROSERVICES/EVENTLOADER/$CONTAINERNAME on zookeeper"

cd /var/www

#This line below is temporary. I had to do this because I was having problems with the kafka node.js libraries and had
#to find a workaround. Take a look at the micro_eventloader container for more details on this workaround until I have 
#the zookeeper working to manage this process
export KAFKAIP=$KAFKAIP

authbind node drillix_micro_eventloader.js 
