#!/bin/bash
if [ -z "$DRX_ZOOKPRSVRS" ]; then
	echo "ENV variable DRX_ZOOKPRSVRS must be set (server1[:port1][,server2[:port2]...]"
	exit 1
fi 
if [ -z "$1" ]; then
	echo "You must have the container name as first argument"
	exit 1
fi
if [ -z "$2" ]; then
	echo "You must enter the PROCESSGROUPID for the queue as second argument"
	exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_worker_loadevents .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" -e "PROCESSGROUP=$2" drillix_worker_loadevents
sudo docker start $1

