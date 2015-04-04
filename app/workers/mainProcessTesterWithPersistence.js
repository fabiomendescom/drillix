
var mainprocess = require('./mainProcess');

module.exports = {	
   'test sending events': function(beforeExit, assert) {	 
	    context = module.exports = {
			done: function (a,b) {
				return null;
			}
		};	
		var event = {};
		var records = [];
		var kinesis = {};
		kinesis.partitionKey = "partitionKey-3";
		kinesis.kinesisSchemaVersion = "1.0";
		kinesis.data = new Buffer('{"Process" : {"Type" : "AddEvent", "Data" : {"account" : "darby", "object" : "sale"}}}').toString('base64');		
		kinesis.sequenceNumber ="49545115243490985018280067714973144582180062593244200961";
		var record = {};
		record.kinesis = kinesis;
		record.eventSource = "aws:kinesis";
		record.eventID = "shardId-000000000000:49545115243490985018280067714973144582180062593244200961";
		record.invokeIdentityArn = "arn:aws:iam::059493405231:role/testLEBRole";
		record.eventVersion = "1.0";
		record.eventName = "aws:kinesis:record";
		record.eventSourceARN = "arn:aws:kinesis:us-east-1:35667example:stream/examplestream";
		record.awsRegion = "us-east-1";
		records.push(record);
		event.Records = records;
				   
		var result = mainprocess.handle(event,context,function() {
			assert.equal("OK", result.status);		
		});
    }     
};

