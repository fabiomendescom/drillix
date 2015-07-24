CONTAINER="zookeeper"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER
sudo docker run -d \
	--name="$CONTAINER" \
	--net=host \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-p 2181:2181 -p 2888:2888 -p 3888:3888 \
	zookeeper
	
sleep 6	

./setzookeepervars.sh	

CONTAINER="nimbus"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=8080" \
	-e "UI_PORT=8080" \
	-p 6627:6627 -p 8080:8080 \
	-p 3773:3773 -p 3772:3772 \
	-p 8000:8000 \
	storm nimbus
	
NIMBUS_ADDR=$(sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${CONTAINER})
	
CONTAINER="supervisor"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=8080" \
	-e "UI_PORT=8080" \
	-p 6703:6703 \
	storm supervisor $NIMBUS_ADDR

CONTAINER="kafka"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9092" \
	-e "BROKER_ID=1" \
	-e "ZKROOT=" \
	-p 9092:9092 \
	kafka
		
CONTAINER="micro_eventloader"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9000" \
	-p 9000:9000 \
	micro_eventloader
	


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
