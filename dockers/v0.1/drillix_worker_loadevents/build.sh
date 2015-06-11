#!/bin/bash

if [ -z "$DRILLIX_COLLECTION_PREFIX" ]; then
	echo "ENV variable DRILLIX_COLLECTION_PREFIX must be set"
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
if [ -z "$3" ]; then
	echo "You must enter the max number of messages for the queue as third argument"
	exit 1
fi
if [ -z "$4" ]; then
	echo "You must enter the queue concurrency as fourth parameter"
	exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_worker_loadevents .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -e "DRILLIX_PROCESSGROUPID=$2"  -e "DRILLIX_QUEUENUMBERMESSAGES=$3" -e "DRILLIX_QUEUECONCURRENCY=$4" -e "DRILLIX_COLLECTION_PREFIX=$DRILLIX_COLLECTION_PREFIX" drillix_worker_loadevents
sudo docker start $1

