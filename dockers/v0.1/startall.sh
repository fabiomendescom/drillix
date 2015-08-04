#!/bin/bash

export MAINROOT="DRILLIX"

CONTAINER="zookeeper"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER
sudo docker run -d \
	--name="$CONTAINER" \
	--net=host \
	-p 2181:2181 -p 2888:2888 -p 3888:3888 \
	zookeeper
	
sleep 6	

CONTAINER="kafka" 
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "BROKER_ID=1" \
	-e "ZKROOT=/$MAINROOT/KAFKA" \
	-p 9092:9092 \
	kafka

sleep 6	
# YOu need to create the events prior. Even though the first call to add to the queue creates the queue, 
# a bug causes the first call to fail. To avoid this, we just create prior
sudo docker exec -it kafka bin/kafka-topics.sh --zookeeper $DRX_ZOOKPRSVRS/DRILLIX/KAFKA --create --partitions 1 --replication-factor 1 --topic events
		
CONTAINER="nimbus"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "ZKROOT=/$MAINROOT/STORM" \
	-p 6627:6627 -p 8080:8080 \
	-p 3773:3773 -p 3772:3772 \
	-p 8000:8000 \
	storm nimbus
	
NIMBUS_ADDR=$(sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' nimbus)

export KAFKAIP=$(sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' kafka)
	
CONTAINER="supervisor"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "ZKROOT=/$MAINROOT/STORM" \
	-e "NIMBUS_ADDR=$NIMBUS_ADDR" \
	-e "KAFKAIP=$(sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' kafka)" \
	-p 6700:6700 -p 6701:6701 -p 6702:6702 -p 6703:6703 \
	storm supervisor
	
./setzookeepervars.sh

sleep 15
		
CONTAINER="micro_eventloader"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9000" \
	-e "KAFKAIP=$(sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' kafka)" \
	-p 9000:9000 \
	micro_eventloader
	
CONTAINER="cassandra"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	--net=host \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "CASSANDRA_LISTEN_ADDRESS=$(ifconfig docker0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')" \
	-e "CASSANDRA_BROADCAST_ADDRESS=$(ifconfig docker0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')" \
	-p 7000:7000 -p 7199:7199 -p 9042:9042 -p 9160:9160 -p 61621:61621 \
	cassandra
	
# run scripts. For some reason, if I run from this program it refuses the connection,
# however, if you do it from the shell command line it works
echo "Pleaser run theh follow statementn manually now"
echo ""
echo "sudo docker exec -it cassandra /bin/sh home/cqlscripts.sh"
echo ""
echo ""

#CONTAINER="redis"
#sudo docker kill $CONTAINER
#sudo docker rm $CONTAINER 
#sudo docker run -d \
#	--name="$CONTAINER" \
#	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
#	-e "CONTAINERNAME=$CONTAINER" \
#	-e "PORTNUMBER=6379" \
#	-p 6379:6379 \
#	redis

#CONTAINER="nginx"
#sudo docker kill $CONTAINER 
#sudo docker rm $CONTAINER
#sudo docker run -d \
#	--name="$CONTAINER" \
#	-p 443:443 \
#	nginx


#CONTAINER="mongodb"
#sudo docker kill $CONTAINER 
#sudo docker rm $CONTAINER 
#sudo docker run -d \
#	--name="$CONTAINER" \
#	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
#	-e "CONTAINERNAME=$CONTAINER" \
#	-p 27017:27017 \
#	mongodb

#CONTAINER="logviewer1"
#sudo docker kill $CONTAINER 
#sudo docker rm $CONTAINER 
#sudo docker run -d \
#	--name="$CONTAINER" \
#	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
#	-e "CONTAINERNAME=$CONTAINER" \
#	-e "PORTNUMBER=9092" \
#	-e "UI_PORT=9022" \
#	-p 8000:8000 \
#	storm --daemon logviewer	
