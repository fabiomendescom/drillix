#!/bin/bash

if [ -z $ZK_IPS ]; then
  echo ZK_IPS needs to be set as environment variable to be able to run.
  exit;
fi

arr=$(echo $ZK_IPS | tr "," "\n")
ZKS=""
ZK_ID=-1
I=0;
for x in $arr
do
    let "I++";
    y=$(echo $x | sed 's/:2181$//')
#    if [[ $HOSTNAME = $y ]]; then
      ZK_ID=$I
#    fi
    ZKS+=$'\nserver.'$I'='$y':2888:3888'
done

if [[ $ZK_ID = -1 ]]; then
  echo This server does not belong to the expected ZooKeeper cluster
  exit;
fi

cat /usr/local/zookeeper/conf/zoo.cfg.template > /usr/local/zookeeper/conf/zoo.cfg

echo $ZK_ID > /mnt/zookeeper/myid

echo "$ZKS" >> /usr/local/zookeeper/conf/zoo.cfg

echo ZKS=$ZKS ZK_ID=$ZK_ID

eval $*
