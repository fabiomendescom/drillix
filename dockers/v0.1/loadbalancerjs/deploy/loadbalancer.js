var http = require('http'),
httpProxy = require('http-proxy');
var seaport = require('seaport');
var ports = seaport.connect('172.17.42.1', 9090);

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var i = -1;
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  //proxy.web(req, res, { target: 'http://172.17.42.1:3000' });
    var addresses = ports.query('web@1.2.3');
    console.log(JSON.stringify(addresses));

    // if there are no workers, give an error
    if (!addresses.length) {
        res.writeHead(503, {'Content-Type' : 'text/plain'});
        res.end('Service unavailable');
        return;
    }

    i = (i + 1) % addresses.length;  
    proxy.web(req, res, addresses[i]);
    
});

console.log("listening on port 80")
server.listen(80);
