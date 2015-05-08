var http = require('http'),
httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {


  proxy.web(req, res, { target: 'http://172.17.42.1:3000' });

    
});

console.log("listening on port 80")
server.listen(80);
