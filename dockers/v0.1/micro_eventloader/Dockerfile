FROM node

#RUN \
#  npm install -g bower && \
#  npm install -g forever && \
#  npm install -g nodemon && \

RUN \
  mkdir -p /var/www && \
  useradd -ms /sbin/nologin node && \
  chown -R node:node /var/www

#allow node user to run services on port 80 and 443 (when prefixed with 'authbind')
RUN \
  apt-get update && \
  apt-get install -y authbind && \
  rm -rf /var/lib/apt/lists/* && \
  touch /etc/authbind/byport/443 && \
  touch /etc/authbind/byport/80 && \
  chown -R node:node /etc/authbind/byport/ && \
  chmod -R 755 /etc/authbind/byport/
  
#RUN \
#	npm install local-ip
	
RUN \
    npm install express  
    
RUN \
	npm install body-parser
    
RUN \
	npm install passport

RUN \
	npm install passport-http-bearer
	
RUN \	
	npm install mongodb
		
RUN \	
	npm install aws-sdk 

RUN \
	npm install redis 
	
RUN \	
	npm install winston 
	
RUN \	
	npm install kafka-node 

RUN \
	npm install node-zookeeper-client 
	
RUN \
	npm install cassandra-driver	

#set to effective working dir for default command (working_dir directive doesn't work in tutum)
ENV NODE_DIR /var/www/

RUN \
	mkdir /var/log/drillix

#COPY ssl/api.drillix.com.key /var/www/api.drillix.com.key
#COPY ssl/api.drillix.com.crt /var/www/api.drillix.com.crt

#COPY ssl/AddTrustExternalCARoot.crt /var/www/AddTrustExternalCARoot.crt
#COPY ssl/COMODORSAAddTrustCA.crt /var/www/COMODORSAAddTrustCA.crt
#COPY ssl/COMODORSADomainValidationSecureServerCA.crt /var/www/COMODORSADomainValidationSecureServerCA.crt

#EXPOSE 80 443
EXPOSE 9000 

WORKDIR /home/vagrant

RUN apt-get update
RUN apt-get -f install
RUN apt-get install -y wget
RUN wget -O /home/vagrant/zookeepercli https://github.com/outbrain/zookeepercli/releases/download/v1.0.10/zookeepercli
RUN chmod +x /home/vagrant/zookeepercli

RUN apt-get install -y net-tools 
	
COPY drillix_micro_eventloader.js /var/www/drillix_micro_eventloader.js	
ADD bootstrapper.sh /home/vagrant/bootstrapper.sh
RUN chmod +x /home/vagrant/bootstrapper.sh
	
USER node

ENTRYPOINT ["./bootstrapper.sh"]
