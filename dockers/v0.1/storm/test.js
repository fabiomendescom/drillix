/*
			var async = require('async');
			var kafka = require('kafka-node'),
				Consumer = kafka.Consumer,
				client = new kafka.Client(process.env.DRX_ZOOKPRSVRS + "/DRILLIX/KAFKA"),
				consumer = new Consumer(
					client,
					[
						{ topic: 'events', offset:0, partition: 0 }
					],
					{
						fromOffset: true,
						autoCommit: false
					}
				);	
				

			consumer.on("message", function(message) {
				console.log(message.value);
			})
*/
		
var Kafka = require('kafka0.8');
var kTransport = new Kafka.Transport({
        zkClient: new Kafka.Zookeeper(process.env.DRX_ZOOKPRSVRS + "/DRILLIX/KAFKA")
    })
    
var options =  {

        payloads: [{                                        /* see 'Payloads' section for more advanced usages */
            topic: 'events',
            partition: 0,
            serializer: new Kafka.Serializer.Json()         /* we will parse json, see 'Serializer' section */
        }],

        /* optionally you can pass a transport layer */
        transport: kTransport,

        /* if you dont it will be created for you, pass your options here */
        timeout: 10000
        /* ... */
    }    

var consumer = new Kafka.Consumer(options, do_consume);
function do_consume() {
    consumer.consume(
        function(msg, meta, next) {
            self.emit(["This is a test"]);
            //console.log('Message :', msg);
            //console.log('Topic:', meta.topic, '- Partition:', meta.partition, '- Offset:', meta.offset);
            /* commit offset to offset store and get next message */
            sync();            
            next();
        },
        function() {
            //console.log('end of this message set');
        },
        function(err) {
            //console.log('done');
            // i can safely loop
            setTimeout(do_consume, 10000);
        }
    )
}
	

setInterval(function() {
		console.log("HI");
},5000);


