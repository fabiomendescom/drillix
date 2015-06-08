var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('172.17.0.33:2181');
var path = "/DRILLIX";

console.log('Trying to connect to the server.');
client.once('connected', function () {
    console.log('Connected to the server.');

    client.create(path, function (error) {
        if (error) {
            console.log('Failed to create node: %s due to: %s.', path, error);
        } else {
            console.log('Node: %s is successfully created.', path);
        }

        client.close();
    });
});

client.connect();
