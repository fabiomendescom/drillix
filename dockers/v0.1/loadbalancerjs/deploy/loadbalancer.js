//INSTANCE SPECIFIC
var redisurl			= process.env.REDIS_URL;
var redisport			= process.env.REDIS_PORT;
var seaportport			= process.env.SEAPORT_PORT;

var logger = require('winston');
var http = require('http'),
httpProxy = require('http-proxy');
var redis = require("redis");
var seaport = require('seaport');


logger.info("STARTING ZOOKEEPER");
var zookeeper = require('node-zookeeper-client');
 
var client = zookeeper.createClient('172.17.42.1:2181');
var path = "/testsss";
 
client.once('connected', function () {
    logger.info('Connected to the server.');
 
    client.create(path, function (error) {
        if (error) {
            logger.error('Failed to create node: %s due to: %s.', path, error);
        } else {
            logger.error('Node: %s is successfully created.', path);
        }
 
        client.close();
    });
});
 
client.connect();
logger.info("DONE ZOOKEEPER");


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

var seaportserver = seaport.createServer();
seaportserver.listen(seaportport);
logger.info("Seaport listening on " + seaportport);

	var redisclient = redis.createClient(redisport,redisurl);

	redisclient.on("error", function (err) {
		logger.error("Error REDIS url " + redisurl + ":" + redisport + " - " + err);
	});	
	var proxy = httpProxy.createProxyServer({});	

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
		var ps = seaportserver.query("drillixevents@0.0.0");
		if (ps.length === 0) {
			logger.error('service not available');
			res.end('service not available\n');
		}
		else {
			logger.info(JSON.stringify(ps));
			var targeturl = 'http://' + ps[0].host.replace("::ffff:","") + ':' + ps[0].port;
			logger.info("Proxing to " + targeturl);
			proxy.web(req, res, { target: targeturl });
		}		
	});
	logger.info("listening on port 80")
	server.listen(80);


