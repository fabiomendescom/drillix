//mongodb client
var MongoClient 		= require('mongodb').MongoClient; //, assert = require('assert');
//config and credentials
var drillixconfig		= require('drillixconfig');
//load processors
var addEventProcessor 	= require('addEventProcessor');

module.exports = {
  handle: function (event, context, callback) {
	//load processors in object to be sent around
	var processors = {};
	processors.AddEvent = addEventProcessor;
	
	MongoClient.connect(drillixconfig.getMongoURI(), function(err, db) {
		if (db == null) {
		   console.log("Problems connecting to mongodb: " + err);
		}	
		
		var max = event.Records.length;
		if(event.Records.length > drillixconfig.getMaxReads()) {max = drillixconfig.getMaxReads()};

		console.log('Starting to process events. Events to be processed: ' + max); 
		
		var results = [];
		event.Records.forEach(function(record) {
			objecttoinsert = decodeAndParse(record.kinesis.data);				
			console.log('Processing event: ' + objecttoinsert.Process.Type);		
			var processtorun = processors[objecttoinsert.Process.Type];				
			processtorun.process(objecttoinsert,db,processors, function(processresult) {													
				results.push(processresult);
				if(results.length == max) {
					final(results);
				}
			});							
		});
		
		function decodeAndParse(arg) {
			encodedPayload = arg;
			payload = new Buffer(encodedPayload, 'base64').toString('ascii');
			objecttoinsert = JSON.parse(payload);		
			return objecttoinsert;	
		}

		function final(results) { 
			console.log("Closing mongodb connection");
			console.log("Results: " + JSON.stringify(results));
			db.close();
			callback(results);
			context.done(null, "Processed " + " Events Successfully"); 				
		}		
/*		
		for(i = 0; i < max; ++i) {
			encodedPayload = event.Records[i].kinesis.data;
			payload = new Buffer(encodedPayload, 'base64').toString('ascii');
			console.log('Processing event: ' + i);
			objecttoinsert = JSON.parse(payload);
			console.log(">>>>> " + objecttoinsert.Process.Type);
			var processtorun = processors[objecttoinsert.Process.Type];
			processtorun.process(objecttoinsert,db,processors, function() {
				
			});	
		}
*/

	});  
  },
};

