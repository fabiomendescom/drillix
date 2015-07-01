#!/bin/bash
if [ -z "$DRX_ZOOKPRSVRS" ]; then
	echo "ENV variable DRX_ZOOKPRSVRS must be set (server1[:port1][,server2[:port2]...]"
	exit 1
fi 
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
sudo docker run -d --name="$1" --env DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS --env CONTAINERNAME=$1 --env PORTNUMBER=6379 -p 6379:6379  drillix_redis



