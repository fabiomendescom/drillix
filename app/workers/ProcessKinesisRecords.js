/*
	This function is called by the Lambda service. It will take the event and see where to route it to so the 
	correct function can handle it
*/

var MongoClient 		= require('mongodb').MongoClient, assert = require('assert');
var payloadRouter       = require('payloadRouter');
var mongouri			= "mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699";                                        
var maxreads            = 20;
  
exports.handler = function(event, context) {
	MongoClient.connect(mongouri, function(err, db) {
		if (err != null) {
		   console.log("Problems connecting to mongodb: " + err);
		}	
		var max = events.Records.length;
		if(event.Records.length > maxreads) {max = maxreads);

		console.log('Starting to process events. Events to be processed: ' + max); 
		for(i = 0; i < max; ++i) {
			encodedPayload = event.Records[i].kinesis.data;
			payload = new Buffer(encodedPayload, 'base64').toString('ascii');
			console.log('Processing event: ' + i);
			payloadRouter.route(payload,db);
		}
		context.done(null, "Processed " + i + " Events Successfully"); 
	});  
};



// inserts the transaction in mongodb
// after inserting it, check which further processing needs to occur and adds to the stream
var transactionLoader = function(payload,db) {
		console.log("Process payload: " + payload);
		objecttoinsert = JSON.parse(payload);   
		//saving to mongodb
		var mongocollection = "darby-sale";  		
		collection = db.collection(mongocollection);
		collection.insert(objecttoinsert,function(err,result){
			if (err != null) {
				console.log("Error in Processing: " + err);
			}	
		});				
		// routes to transaction post processing to stream further information for further processing if necessary
		transactionPostProcessing(payload);
};

// determines what further analysis must be done on the transaction and adds it to the stream
// for further processing
var transactionPostProcessing = function(payload,db) {
	
};
