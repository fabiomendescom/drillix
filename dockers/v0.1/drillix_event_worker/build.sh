#!/bin/bash

if [ -z "$DRILLIX_EVENT_WORKER_ENVPREFIX" ]; then
	echo "ENV variable DRILLIX_EVENT_WORKER_ENVPREFIX must be set"
	exit 1
fi 
if [ -z "$DRILLIX_EVENT_WORKER_QUEUENUMBERMESSAGES" ]; then
	echo "ENV variable DRILLIX_EVENT_WORKER_QUEUENUMBERMESSAGES must be set"
	exit 1
fi
if [ -z "$DRILLIX_EVENT_WORKER_QUEUECONCURRENCY" ]; then
	echo "ENV variable DRILLIX_EVENT_WORKER_QUEUECONCURRENCY must be set"
	exit 1
fi
if [ -z "$1" ]; then
	echo "You must have the container name as an argument"
	exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_event_worker .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1"  -e "QUEUENUMBERMESSAGES=$DRILLIX_EVENT_WORKER_QUEUENUMBERMESSAGES" -e "QUEUECONCURRENCY=$DRILLIX_EVENT_WORKER_QUEUECONCURRENCY" -e "ENVPREFIX=$DRILLIX_EVENT_WORKER_ENVPREFIX" drillix_event_worker
sudo docker start $1
sudo docker logs $1 

