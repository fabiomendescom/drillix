
var storm = require('node-storm');


//var kafka = require('kafka-node'),
//Consumer = kafka.Consumer;


//var client = new kafka.Client("172.17.42.1:2181" + "/DRILLIX/KAFKA"),
//    consumer = new Consumer(
//        client,
//        [
//            { topic: 'events', partition: 0 }
//        ],
//        {
//            autoCommit: false
//        }
//    );	
    

  
var kafkaspout = storm.spout(function(sync) {
	debugger;
	this.emit(["hi"]);
//	consumer.on('message', function (message) {
//		console.log(message);
		// For an unreliable emit:
//		this.emit([message])
		// For a reliable emit:
		//this.emit([fieldValue1, fieldValue2], {id: 'some unique id'})		
		// Tell storm we're done emitting tuples for now
		sync()				
//	});
})
.declareOutputFields(["events"]) // declare output fields
.on('fail', function(data) {
    // Handle tuple failure
    console.log("fail: problems here");
})
.on('ack', function(data) {
    // Handle tuple acknowledgement
    console.log("ack: here");
})


var builder = storm.topologybuilder()

builder.setSpout('kafkaspout', kafkaspout) 
//builder.setBolt('boltid', mybolt, 8).shuffleGrouping('spoutid')

var nimbus = process.argv[2]
	
var options = {
	config: {'topology.debug': true}
}
var topology = builder.createTopology()

options.nimbus = nimbus

storm.submit(topology, options,function(err, topologyName) {
	console.log(err);
	console.log(topologyName);
})
