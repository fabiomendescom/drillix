source /etc/profile

cd drillix_zookeeper
./build.sh drillix.zookeeper1

#need to give time for the server above to pick up before setting vars
sleep 3 

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
cd drillix_storm
./build.sh drillix.nimbus 6700 6701 6702 6703 3772 8000 8080 nimbus
