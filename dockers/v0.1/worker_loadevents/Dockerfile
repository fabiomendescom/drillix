FROM node:0.12-slim

RUN \
  npm install -g bower && \
  npm install -g forever && \
  npm install -g nodemon && \
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
  
RUN \
    npm install express --save  
    
RUN \
	npm install body-parser --save
    
RUN \
	npm install passport --save

RUN \
	npm install passport-http-bearer --save
	
RUN \	
	npm install mongodb --save
	
RUN \
	npm install sqs-queue-parallel --save
		
RUN \	
	npm install aws-sdk --save

RUN \
	npm install sqs-queue-parallel --save
	
RUN \
	npm install sqs --save	
	
RUN \
	npm install redis --save	

RUN \	
	npm install winston --save
	
RUN \
	npm install node-zookeeper-client --save

WORKDIR /var/www/

#set to effective working dir for default command (working_dir directive doesn't work in tutum)
ENV NODE_DIR /var/www/

RUN \
	mkdir /var/log/drillix

COPY drillix_worker_loadevents.js /var/www/drillix_worker_loadevents.js


USER node

CMD node drillix_worker_loadevents.js 
