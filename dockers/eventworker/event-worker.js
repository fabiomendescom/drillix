// Some configs
var tenant				= "darby";
var accesskey 			= "AKIAIUAUOG5OVKIGNYWQ";
var secretkey 			= "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";
var region 				= "us-east-1";
var mongouri			= "mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699";                                        

var SqsQueueParallel = require('sqs-queue-parallel');
var sqs = require('sqs');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Simple configuration:
//  - 2 concurrency listeners
//  - each listener can receive up to 4 messages
// With this configuration you could receive and parse 8 `message` events in parallel
var queue = new SqsQueueParallel({
    name: "darby-events",
    maxNumberOfMessages: 4,
    concurrency: 2,
    region: region,
    accessKeyId: accesskey,
    secretAccessKey: secretkey
});
var associationqueue = sqs({
    access: accesskey,
    secret: secretkey,
    region: region 
});

// Use connect method to connect to the Server
MongoClient.connect(mongouri, function(err, db) {
		//assert.equal(null, err);
		console.log("Connected correctly to mongodb server");

		// Get event messages to process
		queue.on('message', function (e)
		{
			console.log('New message: ', e.metadata, e.data.MessageId)
    
			///////////////////////
			// PROCESS THE EVENT //
			///////////////////////
    				   
			////////////////////////////
			// STEP: Save the event //
			////////////////////////////
			darbysalecollection = db.collection('darby-sale');
			darbysalecollection.insert([
				e.data.sale[0]
			], function(err, result) {
				console.log("Error occurred saving to persistent storage");
			});   
    
			///////////////////////////////////////////////
			// STEP: Delete the message from the queue //
			///////////////////////////////////////////////
     
			e.deleteMessage(function(err, data) {
				e.next();
			});
		});

		queue.on('error', function (err)
		{
			console.log('There was an error: ', err);
		});
});
