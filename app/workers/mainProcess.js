//mongodb client
var MongoClient 		= require('mongodb').MongoClient; //, assert = require('assert');
//config and credentials
var drillixconfig		= require('drillixconfig');
//load processors
var addEventProcessor 	= require('addEventProcessor');

module.exports = {
  handle: function (event, context) {
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

		function async(arg, callback) {
			console.log('do something with \''+arg+'\', return 1 sec later');
			setTimeout(function() { callback(arg * 2); }, 1000);
		}
		function final() { 
			console.log('Done', results); 
		}
		
		var results = [];
		event.Records.forEach(function(record) {
			async(record, function(result) {
				results.push(result);
				if(results.length == event.Records.length) {
				   final();
				}
			});
		});
		
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

		
		context.done(null, "Processed " + " Events Successfully"); 	
		console.log("Closing mongodb connection");
		db.close();
	});  
  },
};

  var results =  function (err, result) {
	  console.log("HI");
  }  
