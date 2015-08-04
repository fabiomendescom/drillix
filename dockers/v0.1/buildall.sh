#!/bin/bash -l

sudo docker build -t zookeeper -f zookeeper/Dockerfile zookeeper   
sudo docker build -t redis -f redis/Dockerfile redis   
sudo docker build -t nginx -f nginx/Dockerfile nginx  
sudo docker build -t micro_eventloader -f micro_eventloader/Dockerfile micro_eventloader
sudo docker build -t kafka -f kafka/Dockerfile kafka
sudo docker build -t storm -f storm/Dockerfile storm
sudo docker build -t cassandra -f cassandra/Dockerfile cassandra

#sudo docker build -t mongodb -f mongodb/Dockerfile mongodb
