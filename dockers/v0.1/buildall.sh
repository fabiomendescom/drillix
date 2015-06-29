source /etc/profile

cd drillix_zookeeper
./build.sh drillix.zookeeper1

#need to give time for the server above to pick up before setting vars
sleep 2 

cd ..
./setzookeepervars.sh

cd drillix_redis
./build.sh drillix.redis1

cd ..
cd drillix_nginx
./build.sh drillix.nginx

cd ..
cd drillix_micro_eventloader
./build.sh drillix.micro_eventloader1 9000

cd ..
cd drillix_kafka
./build.sh drillix.kafka 9092

cd ..
cd drillix_storm
./build.sh drillix.nimbus 6700 6701 6702 6703 3772 8000 8080 nimbus

cd ..
cd drillix_storm
./build.sh drillix.supervisor1 6710 6711 6712 6713 3773 8001 8081 spout

cd ..
cd drillix_storm
./build.sh drillix.ui 6720 6721 6722 6723 3774 8002 8082 ui
