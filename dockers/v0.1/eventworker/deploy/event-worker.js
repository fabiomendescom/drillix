// INSTANCE SPECIFIC
var numberqueuemsgs     = process.env.QUEUENUMBERMESSAGES;
var concurrency			= process.env.QUEUECONCURRENCY;
var processgroup		= process.env.PROCESSGROUP;

var processgroup = {
	id : "GROUP1",
	queue: "events",
	accesskey: 'AKIAIUAUOG5OVKIGNYWQ', 
	secretkey: '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',
	region: 'us-east-1',
	account: '139086185180',
	mongouri: 'mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699'	
}

var queuename               = processgroup.queue;
var mongocollection		= "darby-sale";

var SqsQueueParallel = require('sqs-queue-parallel');
var sqs = require('sqs');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Simple configuration:
//  - 2 concurrency listeners
//  - each listener can receive up to 4 messages
// With this configuration you could receive and parse 8 `message` events in parallel
var queue = new SqsQueueParallel({
    name: queuename,
    maxNumberOfMessages: numberqueuemsgs,
    concurrency: concurrency,
    region: processgroup.region,
    accessKeyId: processgroup.accesskey,
    secretAccessKey: processgroup.secretkey
});

// Use connect method to connect to the Server
MongoClient.connect(processgroup.mongouri, function(err, db) {
		//assert.equal(null, err);
		console.log("Connected correctly to mongodb server");

		// Get event messages to process
		queue.on('message', function (e)
		{
			console.log('New message: ', e.data)
    
			///////////////////////
			// PROCESS THE EVENT //
			///////////////////////
    				   
			////////////////////////////
			// STEP: Save the event //
			////////////////////////////
			collection = db.collection(mongocollection);
			collection.insert([
				e.data
			], function(err, result) {
				
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
