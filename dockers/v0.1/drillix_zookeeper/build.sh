#!/bin/bash

if [ -z "$1" ]; then
        echo "You must have the container name as an argument"
        exit 1
fi

echo "---------------------------------------------"
echo "START BUILDING $1"
echo "---------------------------------------------"
sudo docker build -t drillix_zookeeper .   
sudo docker kill $1 
sudo docker rm $1
ZKID=$(sudo docker run -d --name="$1" --net=host -p 2181:2181 -p 2888:2888 -p 3888:3888  drillix_zookeeper)
