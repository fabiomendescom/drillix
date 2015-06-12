//INSTANCE SPECIFIC
var porttolisten 		= 9000; 

envprefix = envprefix.toString().trim();

var fs = require('fs'),
    https = require('https');

//var redisurl			= process.env.REDIS_URL;
//var redisport			= process.env.REDIS_PORT;

var logger = require('winston');
var express = require('express')
, passport = require('passport')
, util = require('util')
, BearerStrategy = require('passport-http-bearer').Strategy;
var bodyParser = require("body-parser");
var numCPUs = require('os').cpus().length;
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var AWS = require('aws-sdk');
var http = require('http');
 

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

logger.info("ENV: DRILLIX_TOPICTOPUBLISHEVENTS: " + topictopublish);
logger.info("ENV: DRILLIX_COLLECTION_PREFIX: " + envprefix);
logger.info("Starting docker process",getSystemInfo());

function snsmessageadd(msg, req, res, callback) {
	var sns = new AWS.SNS({accessKeyId: req.user.accesskey, secretAccessKey: req.user.secretkey, region: req.user.region});

	var params = {
		Message: msg, 
		TopicArn: topictopublish
	};
	
	sns.publish(params, function(err, data) {
		callback(err, data);
	});
}

function findByToken(token, fn) {
	
		var usercontext =	{ 
				idmd5: 'darby<<<<<836eba7b748c218687265a123c8bd80e',	
				token: 'E95C52F99868D96F6791264A1AE4A', 				
				tenantaccountcode: "10233434",		
				tenantshortcode: "darby",
				tenantname: "Darby Smart",
				tenantadminemail: "karl@darbysmart.com",
				tenantactive: true,
				authgroup: {
					authgroup: "TEST1",
					bucket: "drillixauth",
					awsaccesskey: "AKIAIUAUOG5OVKIGNYWQ",
					awssecretkey: "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",
					awsregion: "us-east-1",
					awsaccount: "139086185180"						
				},		
				processgroup: {
					processgroup: "TEST1",
					eventsnstopic: "test-eventtopic",
					eventqueue: "events",
					awsaccesskey: "AKIAIUAUOG5OVKIGNYWQ",
					awssecretkey: "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",
					awsregion: "us-east-1",
					awsaccount: "139086185180"	
				},
				storagegroup: {
					storagegroup: "TEST1",
					mongouser: "heroku_app34960699",
					mongopassword: "pbho09fpelbpp597c21fu0cami",
					mongohosts: "ds029197.mongolab.com:29197",
					mongodb: "heroku_app34960699",
					mongocollectionprefix: "test_"					
				}					
		}
	
		if(token==usercontext.token) {
			return fn(null,usercontext);
		} else {
			return fn(null,null);
		}	
	
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

/*
var options = {
    key: fs.readFileSync('/var/www/api.drillix.com.key'),
    cert: fs.readFileSync('/var/www/api.drillix.com.crt'),
    ca: [
            fs.readFileSync('/var/www/AddTrustExternalCARoot.crt', 'utf8'),
            fs.readFileSync('/var/www/COMODORSAAddTrustCA.crt', 'utf8'),
            fs.readFileSync('/var/www/COMODORSADomainValidationSecureServerCA.crt', 'utf8')
    ]    
};
*/
 
var app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(function (req, res, next) {
	next()
})	

//var server = https.createServer(options, app).listen(porttolisten, function(){
var server = http.createServer(app).listen(porttolisten, function(){
  logger.info("Express server listening on port " + porttolisten);
});

app.get('/:account/maxsequencetransactions/:transaction',  passport.authenticate('bearer', { session: false }), function(req, res) {
	var countercollection	= envprefix + req.params.account + "-" + "maxsequence";
	MongoClient.connect(req.user.mongouri, function(err, db) {
		if(!err) {
			countercollection = db.collection(countercollection);
			countercollection.findOne({_id: req.params.transaction}, function(err, document) {
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


app.post('/:account/maxsequencetransactions/:transaction',  passport.authenticate('bearer', { session: false }), function(req, res) {
	var countercollection = envprefix + req.params.account + "-"  + "maxsequence";
	MongoClient.connect(req.user.mongouri, function(err, db) {
		if(!err) {
			var stuff = req.body;
			stuff["_id"] = req.params.transaction;
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

app.post('/:account/transactions/:transaction',  passport.authenticate('bearer', { session: false }), function(req, res) {

	var msg = req.body;
	
	var meta = {};	
	meta["account"] = req.params.account;
	meta["type"] = "T";
	meta["name"] = req.params.transaction;
	meta["timestamp"] = new Date().toISOString();
	
	for(i=0;i<msg.events.length;i++) {
		msg.events[i]["_drillixmeta"] = meta;
	}
	
	var msgtext = JSON.stringify(msg);
	
	
	snsmessageadd(msgtext, req, res, function(err, data) {
		if (err) {
			logger.error(err, err.stack); // an error occurred
			res.status(500);
			res.send({"status" : "error","statuscode" : 1,"message" : "Problem inserting event","description" : "Problem inserting event"});						
		}
		else {    
			logger.info(data);           // successful response
			res.status(200);
			res.send({"status" : "success"});						
		}
	});

});



	
