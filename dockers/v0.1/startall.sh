CONTAINER="zookeeper1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER
sudo docker run -d \
	--name="$CONTAINER" \
	--net=host \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-p 2181:2181 -p 2888:2888 -p 3888:3888 \
	zookeeper

CONTAINER="redis1"
sudo docker kill $CONTAINER
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=6379" \
	-p 6379:6379 \
	redis

CONTAINER="nginx1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER
sudo docker run -d \
	--name="$CONTAINER" \
	-p 443:443 \
	nginx

CONTAINER="micro_eventloader1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9000" \
	-p 9000:9000 \
	micro_eventloader

CONTAINER="kafka1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9092" \
	-e "BROKER_ID=1" \
	-e "ZKROOT=/DRILLIX/KAFKA" \
	-p 9092:9092 \
	kafka

CONTAINER="nimbus1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9092" \
	-e "UI_PORT=9022" \
	-p 6627:6627 \
	storm --daemon nimbus

CONTAINER="supervisor1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9092" \
	-e "UI_PORT=9022" \
	-p 6700:6700 -p 6701:6701 -p 6702:6702 -p 6703:6703 \
	storm --daemon supervisor
	
CONTAINER="drpc1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9092" \
	-e "UI_PORT=9022" \
	-p 3773:3773 -p 3772:3772 \
	storm --daemon drpc	

CONTAINER="ui1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9092" \
	-e "UI_PORT=8080" \
	-p 8080:8080 \
	storm --daemon ui

CONTAINER="logviewer1"
sudo docker kill $CONTAINER 
sudo docker rm $CONTAINER 
sudo docker run -d \
	--name="$CONTAINER" \
	-e "DRX_ZOOKPRSVRS=$DRX_ZOOKPRSVRS" \
	-e "CONTAINERNAME=$CONTAINER" \
	-e "PORTNUMBER=9092" \
	-e "UI_PORT=9022" \
	-p 8000:8000 \
	storm --daemon logviewer	
