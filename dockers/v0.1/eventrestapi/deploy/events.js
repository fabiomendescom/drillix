var express = require('express')
, passport = require('passport')
, util = require('util')
, BasicStrategy = require('passport-http').BasicStrategy;

var AWS = require('aws-sdk');
var http = require('http');
var seaport = require('seaport');
var ports = seaport.connect('172.17.42.1', 9090);

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
		username: 'E95C52F99868D96F6791264A1AE4A', 
		accesskey: 'AKIAIUAUOG5OVKIGNYWQ', 
		secretkey: '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',
		region: 'us-east-1',
		account: '139086185180',
		queuename: 'darby-events',
		mongocollection: 'darby-events-sales'
	}
];

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

passport.use(new BasicStrategy({},
	function(username, password, done) {
		// Find the user by username. If there is no user with the given
		// username, or the password is not correct, set the user to `false` to
		// indicate failure. Otherwise, return the authenticated `user`.
		findByUsername(username, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			return done(null, user);
		});
	}
));
 
var app = express();

// Initialize Passport! Note: no need to use session middleware when each
// request carries authentication credentials, as is the case with HTTP Basic.
app.use(passport.initialize());
 
 
app.get('/', function(req, res) {	
	res.send([{name:'wine1'}, {name:'wine2'}]);
});

app.get('/:account/:subaccount/canonical/transactions/:transaction',  passport.authenticate('basic', { session: false }), function(req, res) {
	var msg = "FAAAAA";
	
	sqsmessageadd(msg, req, res, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
			res.status(500);
			res.send({"status" : "error","statuscode" : 1,"message" : "Problem inserting event","description" : "Problem inserting event"});						
		}
		else {    
			console.log(data);           // successful response
			res.send({"status" : "success"});			
			
		}
	});
});

//app.post('/v0.1/events',  passport.authenticate('basic', { session: false }), function(req, res) {
//	res.send({id:req.params.id, name: "The Name", description: "description"});
//});


var porttolisten = ports.register('web@1.2.3',{port:3000});
console.log("preparing to listen on port " + porttolisten);
app.listen(porttolisten);

console.log("listening on port " + porttolisten);

