#!/bin/bash -l
echo "create keyspace drillix with replication = {'class':'SimpleStrategy','replication_factor':3};" > /tmp/querycassandra; cqlsh -u cassandra -p cassandra < /tmp/querycassandra

echo "create table drillix.events (eventuuid uuid PRIMARY KEY,requestuuid uuid,tenantid uuid,dataset text,fields map<text,text>);"  > /tmp/querycassandra; cqlsh -u cassandra -p cassandra < /tmp/querycassandra
