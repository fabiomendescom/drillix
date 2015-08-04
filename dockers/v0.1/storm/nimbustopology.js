var storm = require('node-storm')

var kafkaspout = (function() {

	return storm.spout(function(sync) {
		
			var self = this		

			setInterval(function() {
				self.emit(["Fabio Mendes"]);
				sync();
			},5000);

/*			
			var Kafka = require('kafka0.8');
			var kTransport = new Kafka.Transport({
					zkClient: new Kafka.Zookeeper(process.env.DRX_ZOOKPRSVRS + "/DRILLIX/KAFKA")
				})
    
			var options =  {
					payloads: [{                                        
						topic: 'events',
						partition: 0,
						serializer: new Kafka.Serializer.Json()         
					}],

					transport: kTransport,

					timeout: 60000
				}    

			var consumer = new Kafka.Consumer(options, do_consume);
			function do_consume() {
				consumer.consume(
					function(msg, meta, next) {
						self.emit(["Fabio Mendes"]);
						sync();            
						next();
					},
					function() {
					},
					function(err) {
						setTimeout(do_consume, 2000);
					}
				)
			}		
*/
				
	}).declareOutputFields(["word"])
	
})()

var splitsentence = storm.basicbolt(function(data) {
	var words = data.tuple[0].split(" ")
	for (var i = 0; i < words.length; ++i) {
		var word = words[i].trim()
		if (word) {
			this.emit([word])
		}
	}
}).declareOutputFields(["word"])

var wordcount = (function() {
	var counts = {}

	return storm.basicbolt(function(data) {
		var word = data.tuple[0]
		if (counts[word] == null) {
			counts[word] = 0
		}
		var count = ++counts[word]
		this.emit([word, count])
	}).declareOutputFields(["word", "count"])
})()


	var builder = storm.topologybuilder()
	builder.setSpout('kafkaspout', kafkaspout)
	builder.setBolt('splitsentence', splitsentence, 8).shuffleGrouping('kafkaspout')
	builder.setBolt('wordcount', wordcount, 12).fieldsGrouping('splitsentence', ['word'])

	var nimbus = process.argv[2]
	var options = {
		config: {'topology.debug':false}
	}
	var topology = builder.createTopology()
	if (nimbus == null) {
		var cluster = storm.localcluster()
		cluster.submit(topology, options).then(function() {
			return q.delay(20000)
		}).finally(function() {
			return cluster.shutdown()
		}).fail(console.error)
	} else {
		options.nimbus = nimbus
		storm.submit(topology, options).fail(console.error)	
	}

