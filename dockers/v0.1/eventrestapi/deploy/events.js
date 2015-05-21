//INSTANCE SPECIFIC
var nodename			= process.env.NODE_NAME;
var porttolisten 		= 80; //= process.env.PORT;
//var zookeeperurl		= process.env.ZOOKEEPER_URL;
//var queue               = process.env.EVENTQUEUE;

//var redisurl			= process.env.REDIS_URL;
//var redisport			= process.env.REDIS_PORT;

var logger = require('winston');
var express = require('express')
, passport = require('passport')
, util = require('util')
, BearerStrategy = require('passport-http-bearer').Strategy;
var bodyParser = require("body-parser");
//var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var AWS = require('aws-sdk');
var http = require('http');
//var redis = require("redis");
var kafka = require('kafka');
 

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

logger.info("Starting docker process",getSystemInfo());

//function sqsmessageadd(msg, req, res, callback) {
//	var sqs = new AWS.SQS({accessKeyId: req.user.accesskey, secretAccessKey: req.user.secretkey, region: req.user.region});

//	var params = {
//		MessageBody: msg,
//		QueueUrl: 'https://sqs.' + req.user.region + '.amazonaws.com/' + req.user.account + '/' + queue
//	};
	
//	sqs.sendMessage(params, function(err, data) {
//		callback(err, data);
//	});	
//}

function findByToken(token, fn) {
		var usercontext =	{ 
				id: 1, 
				tenantprefix: "darby-",
				token: 'E95C52F99868D96F6791264A1AE4A', 
				accesskey: 'AKIAIUAUOG5OVKIGNYWQ', 
				secretkey: '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',
				region: 'us-east-1',
				account: '139086185180',
				mongouri: 'mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699'
		}
		return fn(null,usercontext);
	
	//var redisclient = redis.createClient(redisport,redisurl);

	//redisclient.on("error", function (err) {
	//	logger.error("Error REDIS url " + redisurl + ":" + redisport + " - " + err);
	//});	
		
	//redisclient.get(token, function(err, reply) {
	//	logger.info("REDIS value: " + reply);
	//	user = JSON.parse(reply);
	//	return fn(null, user);
	//});			
}

passport.use(new BearerStrategy(
  function(token, done) {
    findByToken(token, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'write' });
    });
  }
));
 
var app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(function (req, res, next) {
	next()
})	

app.get('/:account/:subaccount/canonical/counters/:counter',  passport.authenticate('bearer', { session: false }), function(req, res) {
	var countercollection	= req.user.tenantprefix + "lastid";
	MongoClient.connect(req.user.mongouri, function(err, db) {
		if(!err) {
			countercollection = db.collection(countercollection);
			countercollection.findOne({_id: req.params.counter}, function(err, document) {
				logger.info(document.name);
				res.status(200);
				var response = {};
				response["counter"] = document["_id"];
				response["value"] = document["value"];
				res.send(response);							
			});
		} else {
			res.status(500);
			res.send({"status" : "error","statuscode" : 2,"message" : "Problem connecting to storage","description" : "Problem inserting event"});											
		}
	});

});

app.post('/:account/:subaccount/canonical/counters/:counter',  passport.authenticate('bearer', { session: false }), function(req, res) {
	var countercollection	= req.user.tenantprefix + "lastid";
	MongoClient.connect(req.user.mongouri, function(err, db) {
		if(!err) {
			var stuff = req.body;
			stuff["_id"] = req.params.counter;
			countercollection = db.collection(countercollection);
			countercollection.save(
				stuff
			, function(err, result) {
				if (err) {
					logger.error(err);
					res.status(500);
					res.send({"status" : "error","statuscode" : 1,"message" : "Problem inserting in storage","description" : "Problem inserting event"});								
				} else {
					res.status(200);
					res.send({"status" : "success"});							
				}
			});
		} else {
			res.status(500);
			res.send({"status" : "error","statuscode" : 2,"message" : "Problem connecting to storage","description" : "Problem inserting event"});											
		}
	});
	
});

app.post('/:account/:subaccount/canonical/transactions/:transaction',  passport.authenticate('bearer', { session: false }), function(req, res) {

	var msg = req.body;
	
	var meta = {};	
	meta["account"] = req.params.account;
	meta["subaccount"] = req.params.subaccount;
	meta["type"] = "T";
	meta["name"] = req.params.transaction;
	
	msg["_drillixmeta"] = meta;
	
	var msgtext = JSON.stringify(msg);
    
    var producer = new kafka.Producer({
        // these are also the default values
        host:         '172.17.42.1',
        port:         9092,
        topic:        'test',
        partition:    0
    })
    producer.connect(function() {
		logger.info("sending to topic ");
        producer.send(msgtext)
        res.status(200);
        res.send({"status" : "success"});	
    })
	
	//sqsmessageadd(msgtext, req, res, function(err, data) {
	//	if (err) {
	//		logger.error(err, err.stack); // an error occurred
	//		res.status(500);
	//		res.send({"status" : "error","statuscode" : 1,"message" : "Problem inserting event","description" : "Problem inserting event"});						
	//	}
	//	else {    
	//		logger.info(data);           // successful response
	//		res.status(200);
	//		res.send({"status" : "success", "id" : data.MessageId});						
	//	}
	//});

});

portchosen = porttolisten;
logger.info("preparing to listen on port " + portchosen);

app.listen(portchosen);

logger.info("listening on port " + portchosen);

	
