FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

#This is what I did
#cat api.drillix.com.crt AddTrustExternalCARoot.crt COMODORSAAddTrustCA.crt COMODORSADomainValidationSecureServerCA.crt > api.drillix.com.chained.crt

COPY api.drillix.com.chained.crt /etc/ssl/api.drillix.com.chained.crt
COPY api.drillix.com.key /etc/ssl/api.drillix.com.key

EXPOSE 80
EXPOSE 443
