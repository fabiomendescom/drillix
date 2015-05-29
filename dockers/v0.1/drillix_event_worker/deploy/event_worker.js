// INSTANCE SPECIFIC
var numberqueuemsgs     = process.env.QUEUENUMBERMESSAGES;
var concurrency			= process.env.QUEUECONCURRENCY;
//var processgroup		= process.env.PROCESSGROUP;

var envprefix			= process.env.ENVPREFIX;

var logger = require('winston');
var SqsQueueParallel = require('sqs-queue-parallel');
var sqs = require('sqs');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
//var kafka = require('kafka');
var util = require('util');

function getSystemInfo() {
	os = require('os');
	cpu = os.cpus();
	var info = {	
			cpus: cpu.length,
			model: cpu[0].model,
			speed: cpu[0].speed,
			hostname: os.hostname(),
			ramused: Math.round(os.freemem()/(1024*1000))+"MB",
			ramtotal: Math.round(os.totalmem()/(1024*1000*1000)) + "GB"
	};
	return info;
}

logger.info("ENV: NUMBERQUEUEMESSAGES: " + numberqueuemsgs);
logger.info("ENV: QUEUECONCURRENCY: " + concurrency);
logger.info("ENV: ENVPREFIX: " + envprefix);

logger.info("Starting docker process",getSystemInfo());
  
var processgroup = {
	id : "GROUP1",
	tenantprefix: "darby-",
	queue: "events",
	accesskey: 'AKIAIUAUOG5OVKIGNYWQ', 
	secretkey: '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',
	region: 'us-east-1',
	account: '139086185180',
	mongouri: 'mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699'	
}

var queuename               = processgroup.queue;

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
		logger.info("Connected correctly to mongodb server");

		
		// Get event messages to process
		queue.on('message', function (e)
		{
			//logger.info('New message: ', e.data)
    
			///////////////////////
			// PROCESS THE EVENT //
			///////////////////////
    				   
			////////////////////////////
			// STEP: Save the event //
			////////////////////////////
			
			msg = JSON.parse(e.data.Message);

			mongocollection = envprefix + processgroup.tenantprefix + msg.events[0]["_drillixmeta"].name;
			collection = db.collection(mongocollection);
			collection.insert(
				msg.events
			, function(err, result) {
				
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
			logger.info('There was an error: ', err);
		});
});
