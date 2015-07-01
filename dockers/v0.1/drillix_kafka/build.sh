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
sudo docker run -d --name="$1" -e "ZOOKEEPER_IP=172.17.42.1" -e "ZOOKEEPER_PORT=2181" -e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" -e "CONTAINERNAME=$1" -e "PORTNUMBER=$2" -p $2:9092 drillix_kafka

