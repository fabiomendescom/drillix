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
 * C2 Prod1 Period0
 * C2 Prod1 Period1
 * 
 * C1 Prod1 Period0 | C1 Prod2 Period0 diff = 0
 * C1 Prod1 Period0 | C1 Prod1 Period1 diff = 1
 * C1 Prod1 Period0 | C1 Prod1 Period3 diff = 3
 * C1 Prod2 Period0 | C1 Prod1 Period1 diff = 1
 * C1 Prod2 Period0 | C1 Prod4 Period3 diff = 3
 * C1 Prod1 Period1 | C1 Prod4 Period3 diff = 2
 * C1 Prod2 Period0 | C1 Prod1 Period1 diff = 1
 * C1 Prod2 Period0 | C1 Prod4 Period3 diff = 3
 * C1 Prod1 Period1 | C1 Prod4 Period3 diff = 2
 * C2 Prod1 Period0 | C2 Prod1 Period1 diff = 1
 * 
 * 1. Group data into transactions
 * 
 * {"id" : "C1", "data" : ["Prod1|Prod2|diff0","Prod1|Prod1|diff1","Prod1|Prod1|diff3", "Prod2|Prod1|diff1", "Prod2|Prod4|diff3",
 *                         "Prod1|Prod4|diff2", "Prod2|Prod1|diff1", "Prod2|Prod4|diff3", "Prod1|Prod4|diff2"]}
 * {"id" : "C2", "data" : ["Prod1|Prod1|diff1"]}
 * 
 * 2. Step 1: Transform tuples by content
 * 
 * {"tuples" : ["Prod1|Prod2|diff0"], "count" : 1} <- prune period 0s. They happened at the same time. Or, maybe think about using this combined with non-sequential above
 * {"tuples" : ["Prod1|Prod1|diff1"], "count" : 2}
 * {"tuples" : ["Prod1|Prod1|diff3"], "count" : 1}
 * {"tuples" : ["Prod2|Prod1|diff1"], "count" : 1}
 * {"tuples" : ["Prod2|Prod4|diff3"], "count" : 2}
 * {"tuples" : ["Prod1|Prod4|diff2"], "count" : 2}
 * {"tuples" : ["Prod2|Prod1|diff1"], "count" : 1}
 * 
 * 
 * 
*/



/*


{
    "meta": "basket",
    "forbasket": {
        "named": "basket2",
        "description": "",
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield" : "customer_id",
        "associate": {
            "all | list | range | any": {
                 "from": "sales.product_id"
            },
			"where": {
				"record": "exists"
			}, 		
			"within": {
				"week | month | year" : {
					"from": "returns.sales_date_ym",
					"inrange | inlist": [
						"3"
					]
				}
			}    					
        },
        "with": {
            "all | list | range | some | same": {
                "from": "returns.product_id"
            },
			"where": {
				"condition": {
					"field": "sales.sale_amount",
					"gt": 0
				}
			},  
			"within": {
			    "#" : "months | year",
				"transaction | week | month | year" : {
					"uniquenessdefinedbyfield" : "transaction_id | customer_id",
					"from": "returns.sales_date_ym",
					"inrange | inlist | within": [
						"3"
					]
				}
			}           
        }  
    }
}	

===========================================================================

% of customers who bought product A and bought some product within 3 months
{
    "meta": "basket",
    "forbasket": {
        "named": "basket2",
        "description": {
			"en-US" : [
				"($confidence$)% of customers who bought ($associate.items[0].value$) bought something else ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$). This scenario occurs ($support$)% of all transactions."
			]
        },
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield" : "customer_id",
        "support" : 000,
        "confidence" : 000,
        "lift" : 000,
        "associate": {
			"items": [
				{
					"list": {
						"from": "sales.product_id",
						"values" : [
							"Prod A"
						]
					},
					"where": {
						"record": "exists"
					}	
				}
			]				
        },
        "with": {
			"items" : [
				{
					"some": {
						"from": "sales.product_id"
					},
					"where": {
						"record" : "exists"
					},  
					"timeframes": {
						"from": "sales.sales_date_ym",
						"frames" : [
							"within": {
								"3" : "months"
							}
						]
					}     
				}
			]      
        }  
    }
}	

% of customers who bought 2 products together
{
    "meta": "basket",
    "forbasket": {
        "named": "basket2",
        "description": {
			"en-US" : [
				"($confidence$)% of customers who bought ($associate.items[0].value$) also bought ($with.items[1].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"
			]
        },
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield" : "transaction_id",
        "support" : 000,
        "confidence" : 000,
        "lift" : 000,
        "associate": {
			"items" : [
				{
					"all": {
						"from": "sales.product_id"
					},
					"where": {
						"record": "exists"
					}	
				}
			]				
        },
        "with": {
			"items" : [
				{
					"all": {
						"from": "sales.product_id"
					},
					"where": {
						"record" : "exists"
					}  
				}
			]      
        }  
    }
}	

% of customers who bought a product and returned it within 6 months
{
    "meta": "basket",
    "forbasket": {
        "named": "basket2",
        "description": {
			"en-US" : [
				"($confidence$)% of customers who bought ($associate.items[0].value$) returned it ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"
			]
        },
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield" : "customer_id",
        "support" : 000,
        "confidence" : 000,
        "lift" : 000,
        "associate": {
			"items" : [
				{
					"all": {
						"from": "sales.product_id"
					},
					"where": {
						"record": "exists"
					}	
				}
			]				
        },
        "with": {
			"items" : [
				{
					"same": {
						"from": "returns.product_id"
					},
					"where": {
						"record" : "exists"
					},
					"timeframes": {
						"from": "sales.sales_date_ym",
						"frames" : [
							"within": {
								"6" : "months"
							}
						]
					}  
				}
			]   
        }  
    }
}

% of customers who bought a product and returned it IN 3 weeks
{
    "meta": "basket",
    "forbasket": {
        "named": "basket2",
        "description": {
			"en-US" : [
				"($confidence$)% of customers who bought ($associate.items[0].value$) returned it ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"
			]
        },
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield" : "customer_id",
        "support" : 000,
        "confidence" : 000,
        "lift" : 000,
        "associate": {
			"items" : [
				{
					"all": {
						"from": "sales.product_id"
					},
					"where": {
						"record": "exists"
					}	
				}
			]				
        },
        "with": {
			"items" : [
				{
					"same": {
						"from": "returns.product_id"
					},
					"where": {
						"record" : "exists"
					},
					"timeframe": {
						"from": "sales.sales_date_ym",
						"frames" : [
							"after": {
								"3" : "weeks"
							}
						]
					}    
				} 
			]
        }  
    }
}

Customers who bought prod x and prod y also buy prod z
{
    "meta": "basket",
    "forbasket": {
        "named": "basket2",
        "description": {
			"en-US" : [
				"($confidence$)% of customers who bought ($associate.items[0].value$) and ($associate.items[1].value$) also bought ($with.items[0].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"
			]
        },
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield" : "transaction_id",
        "support" : 000,
        "confidence" : 000,
        "lift" : 000,
        "associate": {
			"items" : [
				{
					"all": {
						"from": "sales.product_id"
					},
					"where": {
						"record": "exists"
					}	
				},
				{
					"all": {
						"from": "sales.product_id"
					},
					"where": {
						"record": "exists"
					}	
				}
			]				
        },
        "with": {
			"items" : [
				{
					"all": {
						"from": "sales.product_id"
					},
					"where": {
						"record" : "exists"
					}  
				}
			]      
        }  
    }
}	

*/			
	
 

