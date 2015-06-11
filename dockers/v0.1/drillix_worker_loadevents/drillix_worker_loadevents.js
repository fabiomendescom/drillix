// INSTANCE SPECIFIC
var numberqueuemsgs     = process.env.DRILLIX_QUEUENUMBERMESSAGES;
var concurrency			= process.env.DRILLIX_QUEUECONCURRENCY;
var envprefix			= process.env.DRILLIX_COLLECTION_ENVPREFIX;
var groupid				= process.env.DRILLIX_PROCESSGROUPID;

envprefix = envprefix.toString().trim();

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

logger.info("ENV: DRILLIX_QUEUENUMBERMESSAGES: " + numberqueuemsgs);
logger.info("ENV: DRILLIX_QUEUECONCURRENCY: " + concurrency);
logger.info("ENV: DRILLIX_COLLECTION_ENVPREFIX: " + envprefix);

logger.info("Starting docker process",getSystemInfo());
  
  
var processgroup = {
	groupid : "GROUP1",
	tenantprefix: "darby-",
	queue: "events",
	awsenvprefix: "DRILLIX_AWS_ENV-TEST-",
	mongoenvprefix: "DRILLIX_MONGO_ENV-TEST-"		
	
	accesskey: 'AKIAIUAUOG5OVKIGNYWQ', 
	secretkey: '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',
	region: 'us-east-1',
	account: '139086185180',
	mongouri: 'mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699'	
}


/*
var processgroup = {
	id : "GROUP1",
	queue: "P1-EventQueue",
	accesskey: 'AKIAJGX6GVRKBYFBMFEA', 
	secretkey: '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',
	region: 'us-west-1',
	account: '195410579593',
	mongouri: 'mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699'	
} 
*/

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

			//By definition, they can only use REST with account on the url to enter this. For thsi reason, it is safe to
			//trust the account to be consistent by looking at only index 0 since we know the entire message is from the 
			//same account
			mongocollection = envprefix + msg.events[0]["_drillixmeta"].account + "-" + msg.events[0]["_drillixmeta"].name;
		
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
