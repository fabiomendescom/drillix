#!/bin/bash

if [ -z "$1" ]; then
	echo "You must have the container name as an argument"
	exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_nginx .   
sudo docker kill $1 
sudo docker rm $1 
sudo docker create --name="$1" -p 80:80 -p 443:443 drillix_nginx
sudo docker start $1

