//INSTANCE SPECIFIC
var redisurl			= process.env.REDIS_URL;
var redisport			= process.env.REDIS_PORT;

var http = require('http'),
httpProxy = require('http-proxy');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var redis = require("redis");

var seaport = require('seaport');
var seaportserver = seaport.createServer();
seaportserver.listen(5001);
console.log("Seaport listening on 5001");

	var redisclient = redis.createClient(redisport,redisurl);

	redisclient.on("error", function (err) {
		console.log("Error REDIS url " + redisurl + ":" + redisport + " - " + err);
	});	
	var proxy = httpProxy.createProxyServer({});
		
	var ports = seaport.connect(5001);		

	var server = http.createServer(function(req, res) {		
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
		redisclient.set(usercontext.token, JSON.stringify(usercontext), redis.print);	
		ports.get('drillixevents@0.0.0', function (ps) {
			console.log(JSON.stringify(ps));
			var targeturl = 'http://' + ps[0].host.replace("::ffff:","") + ':' + ps[0].port;
			console.log("Proxing to " + targeturl);
			proxy.web(req, res, { target: targeturl });
		});	
		
	});
	console.log("listening on port 80")
	server.listen(80);


