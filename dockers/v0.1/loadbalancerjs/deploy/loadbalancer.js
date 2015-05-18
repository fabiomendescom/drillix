//INSTANCE SPECIFIC
var zookeeperurl		= process.env.ZOOKEEPER_URL;

var redisurl			= process.env.REDIS_URL;
var redisport			= process.env.REDIS_PORT;

var logger = require('winston');
var http = require('http'),
httpProxy = require('http-proxy');
var zookeeper = require('node-zookeeper-client');
var redis = require("redis");



var client = zookeeper.createClient(zookeeperurl);
var path = "/DRILLIXSERVICES/REDIS";
 
client.once('connected', function () {
    logger.info('Connected to zookeeper service at ' + zookeeperurl);							
	client.exists(path,function(error, stat) {
		if(error) {
			logger.error(error.stack);
		} else {
			if(stat) {
				console.log("HERE");
				client.getChildren(path, function (error, children, stats) {
					if (error) {
						logger.error(error.stack);
					} else {
						console.log("CHILDREN: " + children);
						var nodetouse = children[0];		
						client.getData(
							path + "/" + nodetouse,
							function (event) {
								logger.info('Got event: %s.', event);
							},
							function (error, data, stat) {
								if (error) {
									logger.error(error.stack);
								} else {
									logger.info('Got data: %s', data.toString('utf8'));
								}
							}
						);								
					}
				});
			} else {
				logger.error("Problems");
			}
		}
	});
});
 
client.connect();




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
	});
	logger.info("listening on port 80")
	server.listen(80);


