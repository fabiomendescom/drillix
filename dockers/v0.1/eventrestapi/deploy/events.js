var express = require('express')
, passport = require('passport')
, util = require('util')
, BearerStrategy = require('passport-http-bearer').Strategy;
var bodyParser = require("body-parser");

var mongouri			= "mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699";                                        

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var AWS = require('aws-sdk');
var http = require('http');

function sqsmessageadd(msg, req, res, callback) {
	var sqs = new AWS.SQS({accessKeyId: req.user.accesskey, secretAccessKey: req.user.secretkey, region: req.user.region});

	var params = {
		MessageBody: msg,
		QueueUrl: 'https://sqs.' + req.user.region + '.amazonaws.com/' + req.user.account + '/' + req.user.queuename
	};
	
	sqs.sendMessage(params, function(err, data) {
		callback(err, data);
	});	
}

var users = [
	{ 
		id: 1, 
		token: 'E95C52F99868D96F6791264A1AE4A', 
		accesskey: 'AKIAIUAUOG5OVKIGNYWQ', 
		secretkey: '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',
		region: 'us-east-1',
		account: '139086185180',
		queuename: 'darby-events',
		mongocollection: 'darby-events-sales'
	}
];

function findByToken(token, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.token === token) {
			return fn(null, user);
		}
	}
	return fn(null, null);
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
  console.log(req.body) // populated!
  next()
})

app.get('/:account/:subaccount/canonical/counters/:counter',  passport.authenticate('bearer', { session: false }), function(req, res) {
	MongoClient.connect(mongouri, function(err, db) {
		if(!err) {
			countercollection = db.collection('darby-lastid');
			countercollection.findOne({_id: req.params.counter}, function(err, document) {
				console.log(document.name);
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
	MongoClient.connect(mongouri, function(err, db) {
		if(!err) {
			var stuff = req.body;
			stuff["_id"] = req.params.counter;
			countercollection = db.collection('darby-lastid');
			countercollection.save(
				stuff
			, function(err, result) {
				if (err) {
					console.log(err);
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
			console.log(err, err.stack); // an error occurred
			res.status(500);
			res.send({"status" : "error","statuscode" : 1,"message" : "Problem inserting event","description" : "Problem inserting event"});						
		}
		else {    
			console.log(data);           // successful response
			res.status(200);
			res.send({"status" : "success", "id" : data.MessageId});			
			
		}
	});
});

var porttolisten = 3000;
console.log("preparing to listen on port " + porttolisten);
app.listen(porttolisten);
console.log("listening on port " + porttolisten);

