var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var mongouri			= "mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699";                                        
  
console.log('Loading event');
exports.handler = function(event, context) {
 MongoClient.connect(mongouri, function(err, db) {	
   console.log(JSON.stringify(event, null, '  '));
   var max = events.Records.length;
   if(event.Records.length > 10) {max = 10);
   for(i = 0; i < max; ++i) {
      encodedPayload = event.Records[i].kinesis.data;
      payload = new Buffer(encodedPayload, 'base64').toString('ascii');
      darbysalecollection = db.collection('darby-sale');
      console.log("Decoded payload: " + payload);
      //console.log("first chars:" + payload.charCodeAt(0) + "-" +  payload.charCodeAt(1) + "-" + payload.charCodeAt(2) + "-" + payload.charCodeAt(3));
      //console.log("last chars:" + payload.charCodeAt(payload.length-3) + "-" + payload.charCodeAt(payload.length-2) + "-" + payload.charCodeAt(payload.length-1)));
	  objecttoinsert = JSON.parse(payload);   
	  darbysalecollection.insert(objecttoinsert,function(err,result){console.log(err)});			
   }
   context.done(null, "Processed Successfully"); 
 });  
};
