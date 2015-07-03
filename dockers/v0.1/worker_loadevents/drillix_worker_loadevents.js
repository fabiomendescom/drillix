var processgroup		= process.env.PROCESSGROUP;

var logger = require('winston');
var SqsQueueParallel = require('sqs-queue-parallel');
var sqs = require('sqs');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var util = require('util');
var AWS = require('aws-sdk'); 

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

var watcher = function (event) {
	if(event.name=="NODE_CHILDREN_CHANGED" && event.path=="/DRILLIX/GLOBALVARS") {
		logger.info("/DRILLIX/GLOBALVARS was changed. Reloading global variables");

		zooclient.getChildren('/DRILLIX/GLOBALVARS', function (event) {watcher(event)}, function (error, children, stats) {
			if (error) {
				console.log(error.stack);
				return;
			}		
			i=1;
			children.toString('utf8').split(',').forEach(function(child) {
				zooclient.getData('/DRILLIX/GLOBALVARS/'+child,function (error, data, stats) {
					globalvars[child] = JSON.parse(data.toString("utf8"));
					if(i==children.toString('utf8').split(',').length) {
						logger.info("Global variables reloaded");			
					}
					i++;				
				})
			})
		});					
	}
}

logger.info("Starting docker process",getSystemInfo());

//load the zookeeper config into env variables
var globalvars = {};
var zookeeper = require('node-zookeeper-client');
logger.info("Zookeeper servers: " + process.env.DRX_ZOOKPRSVRS);
var zooclient = zookeeper.createClient(process.env.DRX_ZOOKPRSVRS);
zooclient.once('connected', function () {
	logger.info("Connected to: " + process.env.DRX_ZOOKPRSVRS);
	zooclient.getChildren('/DRILLIX/GLOBALVARS', function (event) {watcher(event)}, function (error, children, stats) {
		if (error) {
			console.log(error.stack);
			return;
		}		
		i=1;
		children.toString('utf8').split(',').forEach(function(child) {
			zooclient.getData('/DRILLIX/GLOBALVARS/'+child,function (error, data, stats) {
				globalvars[child] = JSON.parse(data.toString("utf8"));
				if(i==children.toString('utf8').split(',').length) {
					logger.info("GLOBALVARS collected from zookeeper " + process.env.DRX_ZOOKPRSVRS);

					function sqsmessageadd(msg,queueurl, callback) {
						var sqs = new AWS.SQS({accessKeyId: globalvars["DRX_PGRP_" + processgroup].awsaccesskey, secretAccessKey: globalvars["DRX_PGRP_" + processgroup].awssecretkey, region: globalvars["DRX_PGRP_" + processgroup].awsregion});

						var params = {
							MessageBody: JSON.stringify(msg), 
							QueueUrl: queueurl
						};
	
						sqs.sendMessage(params, function(err, data) {
							callback(err, data);
						});
					}
										
					// Simple configuration:
					//  - 2 concurrency listeners
					//  - each listener can receive up to 4 messages
					// With this configuration you could receive and parse 8 `message` events in parallel
					var queue = new SqsQueueParallel({
						name: 					globalvars["DRX_PGRP_" + processgroup].eventqueue,
						maxNumberOfMessages: 	1,
						concurrency: 			1,
						region: 				globalvars["DRX_PGRP_" + processgroup].awsregion,
						accessKeyId: 			globalvars["DRX_PGRP_" + processgroup].awsaccesskey,
						secretAccessKey: 		globalvars["DRX_PGRP_" + processgroup].awssecretkey
					});										
					
					// Use connect method to connect to the Server
					var mongouri = "mongodb://"+globalvars["DRX_PGRP_" + processgroup].mongouser+":"+globalvars["DRX_PGRP_" + processgroup].mongopassword+"@"+globalvars["DRX_PGRP_" + processgroup].mongohosts+"/"+globalvars["DRX_PGRP_" + processgroup].mongodb;
					MongoClient.connect(mongouri, function(err, db) {
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
							mongocollection = globalvars["DRX_PGRP_" + processgroup].mongocollectionpref + msg.events[0]["_drillixmeta"].account + "-" + msg.events[0]["_drillixmeta"].name;
		
							collection = db.collection(mongocollection);
							collection.insert(
								msg.events
							, function(err, result) {
								if(err) {
								} else {
									sqsmessageadd(msg, globalvars["DRX_PGRP_" + processgroup].dedupqueueurl, function(err,data) {
										if(err){
											console.log(err);
										}
									});
								}
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
				}
				i++;				
			})
		})
	});	
})
zooclient.connect();


