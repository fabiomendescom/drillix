//INSTANCE SPECIFIC
var porttolisten 		= 9000;

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

function snsmessageadd(msg, req, res, callback) {
	var sns = new AWS.SNS({accessKeyId: req.user.processgroup.awsaccesskey, secretAccessKey: req.user.processgroup.awssecretkey, region: req.user.processgroup.awsregion});

	var params = {
		Message: msg, 
		TopicArn: req.user.processgroup.eventtopic 
	};
	
	sns.publish(params, function(err, data) {
		callback(err, data);
	});
}

function findByToken(token, fn) {
	    var dynamodb = new AWS.DynamoDB({accessKeyId: globalvars["DRX_AGRP"].awsaccesskey, secretAccessKey: globalvars["DRX_AGRP"].awssecretkey, region: globalvars["DRX_AGRP"].awsregion});

		//get the sha256 of the token:	
		var crypto = require("crypto");
		var sha256 = crypto.createHash("sha256");
		sha256.update(token, "utf8");
		var tokensha256 = sha256.digest("base64");

		var params = {
			TableName: globalvars["DRX_AGRP"].awsdynamotbl,			
			Key: { 
				idsha256: { 
					S: tokensha256,
				}
			}
		}
		
		function valueornull(data, value) {
			if(data.hasOwnProperty(value)) {
				return data[value].S;
			} else { 
				return null;
			}
		}

		dynamodb.getItem(params, function(err, data) {
			if (err) {
				console.log(err, err.stack); 
				return fn(null,null);
			} else  {
				//console.log(data);
				if(data.hasOwnProperty("Item")) {
					var usercontext = {};
					usercontext.idsha256 = valueornull(data.Item, "idsha256");
					usercontext.name = valueornull(data.Item, "name");
					usercontext.accountshortcode = valueornull(data.Item, "accountshortcode");
					usercontext.active = valueornull(data.Item, "active");
					usercontext.accountcode = valueornull(data.Item, "accountcode");
					usercontext.adminemail = valueornull(data.Item, "adminemail");
					var processgroup = valueornull(data.Item, "processgroup");
					var storagegroup = valueornull(data.Item, "storagegroup");
					if(processgroup!=null) {
						usercontext.processgroup = {};
						usercontext.processgroup.id = processgroup;
						usercontext.processgroup.eventqueue = globalvars["DRX_PGRP_" + processgroup].eventqueue;
						usercontext.processgroup.eventtopic = globalvars["DRX_PGRP_" + processgroup].eventtopic;
						usercontext.processgroup.awsaccesskey = globalvars["DRX_PGRP_" + processgroup].awsaccesskey;
						usercontext.processgroup.awssecretkey = globalvars["DRX_PGRP_" + processgroup].awssecretkey;
						usercontext.processgroup.awsregion = globalvars["DRX_PGRP_" + processgroup].awsregion;
						usercontext.processgroup.awsaccount = globalvars["DRX_PGRP_" + processgroup].awsaccount;				
						usercontext.processgroup.mongouser = globalvars["DRX_PGRP_" + processgroup].mongouser;
						usercontext.processgroup.mongopassword = globalvars["DRX_PGRP_" + processgroup].mongopassword;
						usercontext.processgroup.mongohosts = globalvars["DRX_PGRP_" + processgroup].mongohosts;
						usercontext.processgroup.mongodb = globalvars["DRX_PGRP_" + processgroup].mongodb;
						usercontext.processgroup.mongocollectionprefix = globalvars["DRX_PGRP_" + processgroup].mongocollectionpref;
						usercontext.processgroup.mongouri = "mongodb://"+usercontext.processgroup.mongouser+":"+usercontext.processgroup.mongopassword+"@"+usercontext.processgroup.mongohosts+"/"+usercontext.processgroup.mongodb;											
					}
					return fn(null,usercontext);
				} else {
					return fn(null,null);
				}
			}	           
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

app.get('/:account/maxsequencetransactions/:transaction',  passport.authenticate('bearer', { session: false }), function(req, res) {
	var countercollection	= req.user.storagegroup.mongocollectionprefix + req.params.account + "-" + "maxsequence";
	MongoClient.connect(req.user.storagegroup.mongouri, function(err, db) {
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
	var countercollection = req.user.storagegroup.mongocollectionprefix + req.params.account + "-"  + "maxsequence";
	MongoClient.connect(req.user.storagegroup.mongouri, function(err, db) {
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

/*
redisurl = "172.17.42.1";
redisport = "6379";

var redis = require("redis");

var redisclient = redis.createClient(redisport,redisurl);

redisclient.on("error", function (err) {
	logger.error("Error REDIS url " + redisurl + ":" + redisport + " - " + err);	
});	
*/

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
					var server = http.createServer(app).listen(porttolisten, function(){
						logger.info("Express server listening on port " + porttolisten);
					});					
				}
				i++;				
			})
		})
	});	
})
zooclient.connect();



																																		

				 








	
