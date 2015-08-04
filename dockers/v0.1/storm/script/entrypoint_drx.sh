#!/bin/bash

set -e

usage="Usage: startup.sh [(nimbus|drpc|supervisor|ui|logviewer]"

#if [ $# -lt 1 ]; then
# echo $usage >&2;
 #exit 2;
#fi

#daemons=(nimbus, drpc, supervisor, ui, logviewer)

# Create supervisor configurations for Storm daemons
create_supervisor_conf () {
    echo "Create supervisord configuration for storm daemon $1"
    cat /home/storm/storm-daemon.conf | sed s,%daemon%,$1,g | tee -a /etc/supervisor/conf.d/storm-$1.conf
}	

# done by Fabio below
# parse the DRX_ZOOKPRSVRS to remove the IPS and put in the new format for the config file
IFS=',' read -ra FULLZOOADDRS <<< "$DRX_ZOOKPRSVRS"
for FULLZOOADDR in "${FULLZOOADDRS[@]}"; do
	IFS=':' read -ra IPPORTS <<< "$FULLZOOADDR"
	ZOOIPS="$ZOOIPS    - \"${IPPORTS[0]}\"\n"
    ZOOPORT=${IPPORTS[1]}
done

# Command
case $1 in
   nimbus)
          create_supervisor_conf nimbus
          create_supervisor_conf ui
		  MYIP=$(ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p') 
		  echo "My IP is $MYIP"
		  echo "Registering this node as nimbus with address $MYIP"
		  #MAINROOT="DRILLIX"
		  #echo "Zookeeper servers: $DRX_ZOOKPRSVRS"
		  #echo "Check existence: /$MAINROOT/GLOBALVARS/NIMBUS"
		  #ZOO=$(/home/storm/zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /$MAINROOT/GLOBALVARS/NIMBUS)
		  #if [ $ZOO ]; then
			#/home/storm/zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /$MAINROOT/GLOBALVARS/NIMBUS 
		  #fi		  
		  #echo "Create /home/storm/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /$MAINROOT/GLOBALVARS/NIMBUS $MYIP"
		  #/home/storm/zookeepercli --servers $DRX_ZOOKPRSVRS -c create /$MAINROOT/GLOBALVARS/NIMBUS $MYIP
		  awk -v ZOOIPS="$ZOOIPS" -v NIMBUS_ADDR="$MYIP" -v ZKROOT=$ZKROOT '{
			sub(/%zookeeper%/, ZOOIPS);
			sub(/%nimbus%/, NIMBUS_ADDR);
			sub(/%ui%/, NIMBUS_ADDR);
			sub(/%zookeeperroot%/, ZKROOT);
			print;
		  }' $STORM_HOME/conf/storm.yaml.nimbus.template > $STORM_HOME/conf/storm.yaml		           
    ;;
    supervisor)
          create_supervisor_conf supervisor
          echo "Registering this node as supervisor with nimbus $NIMBUS_ADDR"
          #MAINROOT="DRILLIX"
          #NIMBUS_ADDR=$(/home/storm/zookeepercli --servers $DRX_ZOOKPRSVRS -c get /$MAINROOT/GLOBALVARS/NIMBUS)
          #NIMBUS_ADDR=$2  #IP address of the nimbus
		  awk -v ZOOIPS="$ZOOIPS" -v NIMBUS_ADDR="$NIMBUS_ADDR" -v ZKROOT=$ZKROOT '{
			sub(/%zookeeper%/, ZOOIPS);
			sub(/%nimbus%/, NIMBUS_ADDR);
			sub(/%zookeeperroot%/, ZKROOT);
			print;
		  }' $STORM_HOME/conf/storm.yaml.supervisor.template > $STORM_HOME/conf/storm.yaml	          
    ;;
    *)
        echo $usage
        exit 1;
    ;;
esac



# Set zookeeper address to localhost by default
#if [ -z "$ZOOKEEPER_ADDR" ]; then
#  export ZOOKEEPER_ADDR=127.0.0.1;
#fi

# Set storm UI port to 8080 by default
#if [ -z "$UI_PORT" ]; then
 # export UI_PORT=8080;
#fi

# storm.yaml - replace zookeeper and nimbus ports with environment variables exposed by Docker container(see docker run --link name:alias)
#if [ ! -z "$NIMBUS_PORT_6627_TCP_ADDR" ]; then
#  export NIMBUS_ADDR=$NIMBUS_PORT_6627_TCP_ADDR;
#fi

#if [ ! -z "$ZK_PORT_2181_TCP_ADDR" ]; then
#  export ZOOKEEPER_ADDR=$ZK_PORT_2181_TCP_ADDR;
#fi

#cp $STORM_HOME/conf/storm.yaml.template $STORM_HOME/conf/storm.yaml



#echo $ZOOIPS

#ZOOIPS="172.17.42.1"

#Fabio changed the next line below. Put variable ZOOIPS
#sed -i s/%zookeeper%/$ZOOIPS/g $STORM_HOME/conf/storm.yaml
#sed -i s/%nimbus%/$NIMBUS_ADDR/g $STORM_HOME/conf/storm.yaml	
#sed -i s/%ui_port%/$UI_PORT/g $STORM_HOME/conf/storm.yaml


echo "Starting supervisor"
supervisord

 

exit 0;
