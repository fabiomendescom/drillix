cd /vagrant/drillix/storm
mvn clean package 
cp /vagrant/drillix/storm/target/kstorm-1.0-SNAPSHOT-jar-with-dependencies.jar /vagrant/drillix/dockers/v0.1/storm/kstorm-1.0-SNAPSHOT-jar-with-dependencies.jar
cd /vagrant/drillix/dockers/v0.1
sudo docker build -t storm -f storm/Dockerfile storm
sleep 10
./startall.sh
sleep 60 
cd storm
sudo docker exec -it nimbus storm jar kstorm-1.0-SNAPSHOT-jar-with-dependencies.jar quux00.wordcount.kafka.WordCountAckedTopology
