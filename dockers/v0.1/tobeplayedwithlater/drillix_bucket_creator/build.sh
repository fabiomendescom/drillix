#!/bin/bash

if [ -z "$DRILLIX_EVENTS_TOPICTOPUBLISH" ]; then
	echo "ENV variable DRILLIX_EVENTS_TOPICTOPUBLISH name must be set" 
	exit 1
fi
if [ -z "$DRILLIX_EVENTS_ENVPREFIX"]; then
	echo "ENV variable DRILLIX_EVENTS_ENVPREFIX must be set"
	exit 1
fi 
if [ -z "$1" ]; then
	echo "You must have the container name as an argument"
	exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_bucket_creator .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -e "ENVPREFIX=$DRILLIX_EVENTS_ENVPREFIX" -e "TOPICTOPUBLISH=$DRILLIX_EVENTS_TOPICTOPUBLISH" -p 80:80 -p 443:443 drillix_bucket_creator
sudo docker start $1
sudo docker logs $1 

