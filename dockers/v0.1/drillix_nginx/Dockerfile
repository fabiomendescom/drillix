FROM nginx

ADD bootstrapper.sh /home/vagrant/bootstrapper.sh
RUN chmod +x /home/vagrant/bootstrapper.sh

WORKDIR /home/vagrant

RUN apt-get update
RUN apt-get -f install
RUN apt-get install -y wget
RUN wget -O /home/vagrant/zookeepercli https://github.com/outbrain/zookeepercli/releases/download/v1.0.10/zookeepercli
RUN chmod +x /home/vagrant/zookeepercli

RUN apt-get install -y net-tools 	

COPY nginx.conf /etc/nginx/nginx.conf

#This is what I did
#cat api.drillix.com.crt AddTrustExternalCARoot.crt COMODORSAAddTrustCA.crt COMODORSADomainValidationSecureServerCA.crt > api.drillix.com.chained.crt

COPY api.drillix.com.chained.crt /etc/ssl/api.drillix.com.chained.crt
COPY api.drillix.com.key /etc/ssl/api.drillix.com.key

EXPOSE 80
EXPOSE 443
