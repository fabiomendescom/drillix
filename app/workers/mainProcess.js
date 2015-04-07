//mongodb client
var MongoClient 		= require('mongodb').MongoClient; //, assert = require('assert');
//config and credentials
var drillixconfig		= require('./drillixconfig');
//load processors
var addEventProcessor 	= require('./addEventProcessor');

module.exports = {
  handle: function (event, context, callback) {
	//load processors in object to be sent around
	var processors = {};
	processors.AddEvent = addEventProcessor;
	
	MongoClient.connect(drillixconfig.getMongoURI(), function(err, db) {
		if (db == null) {
		   //console.log("Problems connecting to mongodb: " + err);
		   context.done(err, "Problems connecting to mongodb"); 
		}	
		
		var numberofrecords = event.Records.length;

		//console.log('Starting to process events. Events to be processed: ' + numberofrecords); 
		
		var results = [];
		event.Records.forEach(function(record) {
			objecttoinsert = decodeAndParse(record.kinesis.data);				
			//console.log('Processing event: ' + objecttoinsert.Process.Type);		
			var processtorun = processors[objecttoinsert.Process.Type];				
			processtorun.process(objecttoinsert,db,processors, function(processresult) {													
				results.push(processresult);
				if(results.length == numberofrecords) {
					final(results);
				}
			});							
		});
		
		function decodeAndParse(arg) {
			encodedPayload = arg;
			payload = new Buffer(encodedPayload, 'base64').toString('ascii');
			objecttoinsert = JSON.parse(payload);		
			return objecttoinsert;	
		}

		function final(results) { 
			//console.log("Closing mongodb connection");
			//console.log("Results: " + JSON.stringify(results));
			db.close();
			callback(results);		
		}		
	});  
  },
};

/*
 * https://www.youtube.com/watch?v=Hk1zFOMLTrw
 * How the data is coming transactionally through the stream to start
 * T100 Prod 1
 * T100 Prod 3
 * T100 Prod 4
 * T200 Prod 2
 * T200 Prod 3
 * T200 Prod 5
 * T300 Prod 1
 * T300 Prod 2
 * T300 Prod 3
 * T300 Prod 5
 * T400 Prod 2
 * T400 Prod 5
 * T500 Prod 1
 * T500 Prod 3
 * T500 Prod 5
 * 
 * 1. Group data into transactions
 * 
 * {"id" : "T100", "data" : ["Prod 1", "Prod 3", "Prod 4"]}
 * {"id" : "T200", "data" : ["Prod 2", "Prod 3", "Prod 5"]}
 * {"id" : "T300", "data" : ["Prod 1", "Prod 2", "Prod 3", "Prod 5"]}
 * {"id" : "T400", "data" : ["Prod 2", "Prod 5"]}
 * {"id" : "T500", "data" : ["Prod 1", "Prod 3", "Prod 5"]}
 * 
 * 2. Step 1: Transform tuples by content
 * 
 * {"tuples" : ["Prod 1"], "count" : 3}
 * {"tuples" : ["Prod 2"], "count" : 3}
 * {"tuples" : ["Prod 3"], "count" : 4}
 * {"tuples" : ["Prod 4"], "count" : 1}
 * {"tuples" : ["Prod 5"], "count" : 4}
 * 
 * 3. Remove low support items (min support = 2)
 * 
 * {"tuples" : ["Prod 1"], "count" : 3}
 * {"tuples" : ["Prod 2"], "count" : 3}
 * {"tuples" : ["Prod 3"], "count" : 4}
 * {"tuples" : ["Prod 5"], "count" : 4}
 * 
 * 4. Step 2: combine in pairs
 * 
 * {"tuples" : ["Prod 1", "Prod 2"], "count" : 1}
 * {"tuples" : ["Prod 1", "Prod 3"], "count" : 3}
 * {"tuples" : ["Prod 1", "Prod 5"], "count" : 2}
 * {"tuples" : ["Prod 2", "Prod 3"], "count" : 2}
 * {"tuples" : ["Prod 2", "Prod 5"], "count" : 3}
 * {"tuples" : ["Prod 3", "Prod 5"], "count" : 3}
 * 
 * 5. Remove low support items (min support = 2)
 * 
 * {"tuples" : ["Prod 1", "Prod 3"], "count" : 3}
 * {"tuples" : ["Prod 1", "Prod 5"], "count" : 2}
 * {"tuples" : ["Prod 2", "Prod 3"], "count" : 2}
 * {"tuples" : ["Prod 2", "Prod 5"], "count" : 3}
 * {"tuples" : ["Prod 3", "Prod 5"], "count" : 3}
 * 
 * 6. Step 3: combine in triples
 * 
 * {"tuples" : ["Prod 1", "Prod 2", "Prod 3"]}
 * {"tuples" : ["Prod 1", "Prod 2", "Prod 5"]}
 * {"tuples" : ["Prod 1", "Prod 3", "Prod 5"]}
 * {"tuples" : ["Prod 2", "Prod 3", "Prod 5"]}
 * 
 * 7. Get all combinations of the tuples in previous step
 * 
 * for Prod 1, Prod 2, Prod 3
 * {"tuple" : ["Prod 1", "Prod 2"], "appear" : 0}  <- first time it does not appear should stop algorithm
 * {"tuple" : ["Prod 1", "Prod 3"], "appear" : 1}
 * {"tuple" : ["Prod 2", "Prod 3"], "appear" : 1}
 * 
 * for Prod 1, Prod 2, Prod 5
 * {"tuple" : ["Prod 1", "Prod 2"], "appear" : 0}  <- first time it does not appear should stop algorithm
 * {"tuple" : ["Prod 1", "Prod 5"], "appear" : 1}
 * {"tuple" : ["Prod 2", "Prod 5"], "appear" : 1}
 * 
 * For Prod 1, Prod 3, Prod 5
 * {"tuple" : ["Prod 1", "Prod 3"], "appear" : 1}  
 * {"tuple" : ["Prod 1", "Prod 5"], "appear" : 1}
 * {"tuple" : ["Prod 3", "Prod 5"], "appear" : 1}
 * 
 * For Prod 2, Prod 3, Prod 5
 * {"tuple" : ["Prod 2", "Prod 3"], "appear" : 1}  
 * {"tuple" : ["Prod 2", "Prod 5"], "appear" : 1}
 * {"tuple" : ["Prod 3", "Prod 5"], "appear" : 1}
 * 
 * 8. Count support for the tuples of 3
 * 
 * {"tuples" : ["Prod 1", "Prod 3", "Prod 5"], "count" : 2}
 * {"tuples" : ["Prod 2", "Prod 3", "Prod 5"], "count" : 2}
 * 
 * 9. Prune by wiping out anything less thann 2 in support
 * 
 * keep going until you have an empty frequency set. Then, return the set from the previous interation
 * 
 * 
 * C1 Prod1 Period0
 * C1 Prod2 Period0
 * C1 Prod1 Period1
 * C1 Prod4	Period3
 * 
 * 1. Group data into transactions
 * 
 * {"id" : "C1", "data" : ["Prod 1|Period201101", "Prod 2|Period201101", "Prod 1|Period201102", "Prod4|Period201103"]}


*/

/*
{
    "meta": "basket",
    "forbasket": {
        "named": "basket2",
        "description": "",
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "scopedby": "customer",
        "definedby": "sales.customer_id",
        "associate": {
            "all": {
                "absolutevalues": {
                    "from": "sales.product_id"
                }
            }
        },
        "and": {
            "specific": {
                "relativevalues": {
                    "from": "returns.sales_date_ym",
                    "definedas": [
                        "3"
                    ]
                }
            }
        },
        "with": {
            "all": {
                "absolutevalues": {
                    "from": "returns.product_id"
                }
            }
        },
        "where": {
            "field": "sales.sale_amount",
            "gt": 0
        }
    }
}	
*/			
	
 

