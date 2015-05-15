//INSTANCE SPECIFIC
var redisurl			= process.env.REDIS_URL;
var redisport			= process.env.REDIS_PORT;
var porttolisten 		= process.env.PORT;
var queue               = process.env.EVENTQUEUE;
var seaportaddr			= process.env.SEAPORT_ADDR;
var seaportport			= process.env.SEAPORT_PORT;

var logger = require('winston');
var express = require('express')
, passport = require('passport')
, util = require('util')
, BearerStrategy = require('passport-http-bearer').Strategy;
var bodyParser = require("body-parser");
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var AWS = require('aws-sdk');
var http = require('http');
var redis = require("redis");
var seaport = require("seaport");


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

function sqsmessageadd(msg, req, res, callback) {
	var sqs = new AWS.SQS({accessKeyId: req.user.accesskey, secretAccessKey: req.user.secretkey, region: req.user.region});

	var params = {
		MessageBody: msg,
		QueueUrl: 'https://sqs.' + req.user.region + '.amazonaws.com/' + req.user.account + '/' + queue
	};
	
	sqs.sendMessage(params, function(err, data) {
		callback(err, data);
	});	
}

function findByToken(token, fn) {
	var redisclient = redis.createClient(redisport,redisurl);

	redisclient.on("error", function (err) {
		logger.error("Error REDIS url " + redisurl + ":" + redisport + " - " + err);
	});	
		
	redisclient.get(token, function(err, reply) {
		logger.info("REDIS value: " + reply);
		user = JSON.parse(reply);
		return fn(null, user);
	});			
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
	logger.info(req.body) // populated!
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
	MongoClient.connect(mongouri, function(err, db) {
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
	
	sqsmessageadd(msgtext, req, res, function(err, data) {
		if (err) {
			logger.error(err, err.stack); // an error occurred
			res.status(500);
			res.send({"status" : "error","statuscode" : 1,"message" : "Problem inserting event","description" : "Problem inserting event"});						
		}
		else {    
			logger.info(data);           // successful response
			res.status(200);
			res.send({"status" : "success", "id" : data.MessageId});						
		}
	});

});


var ports = seaport.connect(seaportaddr, seaportport);
ports.service('drillixevents@0.0.0', function (port, ready) {
    log.info("I M HERE");
});

portchosen = ports.register('drillixevents@0.0.0',{port: porttolisten});
logger.info("preparing to listen on port " + portchosen);

app.listen(portchosen);

logger.info("listening on port " + portchosen);

	
