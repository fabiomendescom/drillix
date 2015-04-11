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
 * Confidence = itemset support / ante support
 * Lift = itemset support / (ante support x conseq support)
 * 
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
 * {"id" : "T100", "data" : ["((sales))Prod 1", "((sales))Prod 3", "((sales))Prod 4"]}
 * {"id" : "T200", "data" : ["((sales))Prod 2", "((sales))Prod 3", "((sales))Prod 5"]}
 * {"id" : "T300", "data" : ["((sales))Prod 1", "((sales))Prod 2", "((sales))Prod 3", "((sales))Prod 5"]}
 * {"id" : "T400", "data" : ["((sales))Prod 2", "((sales))Prod 5"]}
 * {"id" : "T500", "data" : ["((sales))Prod 1", "((sales))Prod 3", "((sales))Prod 5"]}
 * 
 * 2. Step 1: Transform tuples by content
 * 
 * {"tuples" : ["((sales))Prod 1"], "count" : 3}
 * {"tuples" : ["((sales))Prod 2"], "count" : 3}
 * {"tuples" : ["((sales))Prod 3"], "count" : 4}
 * {"tuples" : ["((sales))Prod 4"], "count" : 1}
 * {"tuples" : ["((sales))Prod 5"], "count" : 4}
 * 
 * 3. Remove low support items (min support = 2)
 * 
 * {"tuples" : ["((sales))Prod 1"], "count" : 3}
 * {"tuples" : ["((sales))Prod 2"], "count" : 3}
 * {"tuples" : ["((sales))Prod 3"], "count" : 4}
 * {"tuples" : ["((sales))Prod 5"], "count" : 4}
 * 
 * 4. Step 2: combine in pairs
 * 
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 2"], "count" : 1}
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 3"], "count" : 3}
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 5"], "count" : 2}
 * {"tuples" : ["((sales))Prod 2", "((sales))Prod 3"], "count" : 2}
 * {"tuples" : ["((sales))Prod 2", "((sales))Prod 5"], "count" : 3}
 * {"tuples" : ["((sales))Prod 3", "((sales))Prod 5"], "count" : 3}
 * 
 * 5. Remove low support items (min support = 2)
 * 
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 3"], "count" : 3}
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 5"], "count" : 2}
 * {"tuples" : ["((sales))Prod 2", "((sales))Prod 3"], "count" : 2}
 * {"tuples" : ["((sales))Prod 2", "((sales))Prod 5"], "count" : 3}
 * {"tuples" : ["((sales))Prod 3", "((sales))Prod 5"], "count" : 3}
 * 
 * 6. Step 3: combine in triples
 * 
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 2", "((sales))Prod 3"]}
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 2", "((sales))Prod 5"]}
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 3", "((sales))Prod 5"]}
 * {"tuples" : ["((sales))Prod 2", "((sales))Prod 3", "((sales))Prod 5"]}
 * 
 * 7. Get all combinations of the tuples in previous step
 * 
 * for Prod 1, Prod 2, Prod 3
 * "tuple" : ["((sales))Prod 1", "((sales))Prod 2"], "appear" : 0}  <- first time it does not appear should stop algorithm
 * "tuple" : ["((sales))Prod 1", "((sales))Prod 3"], "appear" : 1}
 * "tuple" : ["((sales))Prod 2", "((sales))Prod 3"], "appear" : 1}
 * 
 * for Prod 1, Prod 2, Prod 5
 * {"tuple" : ["((sales))Prod 1", "((sales))Prod 2"], "appear" : 0}  <- first time it does not appear should stop algorithm
 * {"tuple" : ["((sales))Prod 1", "((sales))Prod 5"], "appear" : 1}
 * {"tuple" : ["((sales))Prod 2", "((sales))Prod 5"], "appear" : 1}
 * 
 * For Prod 1, Prod 3, Prod 5
 * {"tuple" : ["((sales))Prod 1", "((sales))Prod 3"], "appear" : 1}  
 * {"tuple" : ["((sales))Prod 1", "((sales))Prod 5"], "appear" : 1}
 * {"tuple" : ["((sales))Prod 3", "((sales))Prod 5"], "appear" : 1}
 * 
 * For Prod 2, Prod 3, Prod 5
 * {"tuple" : ["((sales))Prod 2", "((sales))Prod 3"], "appear" : 1}  
 * {"tuple" : ["((sales))Prod 2", "((sales))Prod 5"], "appear" : 1}
 * {"tuple" : ["((sales))Prod 3", "((sales))Prod 5"], "appear" : 1}
 * 
 * 8. Count support for the tuples of 3
 * 
 * {"tuples" : ["((sales))Prod 1", "((sales))Prod 3", "((sales))Prod 5"], "count" : 2}
 * {"tuples" : ["((sales))Prod 2", "((sales))Prod 3", "((sales))Prod 5"], "count" : 2}
 * 
 * 9. Prune by wiping out anything less than 2 in support
 * 
 * keep going until you have an empty frequency set. Then, return the set from the previous interation
 * 
 * 
 * 
 * PERIOD 0 - March 1
 * C1 Prod1 March 1 Period 0
 * C1 Prod2 March 1 Period 0
 * C1 Prod1 March 2 Period 1
 * C1 Prod4	March 3 Period 2
 * C2 Prod1 March 2 Period 2
 * C2 Prod1 March 1 Period 2
 * 
 * C1 ((sales))Prod1 | ((sales))Prod2 | diff0
 * C1 ((sales))Prod1 | ((sales))Prod1 | diff1
 * C1 ((sales))Prod1 | ((sales))Prod4 | diff2
 * C1 ((sales))Prod2 | ((sales))Prod1 | diff1
 * C1 ((sales))Prod2 | ((sales))Prod4 | diff2
 * C1 ((sales))Prod1 | ((sales))Prod4 | diff1
 * C2 ((sales))Prod1 | ((sales))Prod1 | diff0
 * 
 * 
 * 1. For every record coming in, consider it period 0 and save it. Then look up at the basket definition to know how far the
 * period has to go (there could be many). Letś suppose "within 3 months". Search the db backwards "3 months or less" and see
 * if you find a hit. If you do, add this record as "diff3" as well, since it means this record is within 3 months counting
 * from the past. It will be considered a period0 and period3. They are always done in pairs
 * 
 * 2. Step 1: Transform tuples by content
 * 
 * {"tuples" : ["((sales))Prod1|((returns))Prod2|diff0"], "count" : 1} <- prune period 0s. They happened at the same time. Or, maybe think about using this combined with non-sequential above
 * {"tuples" : ["((sales))Prod1|((returns))Prod1|diff1"], "count" : 2}
 * {"tuples" : ["((sales))Prod1|((returns))Prod1|diff3"], "count" : 1}
 * {"tuples" : ["((sales))Prod2|((returns))Prod1|diff1"], "count" : 1}
 * {"tuples" : ["((sales))Prod2|((returns))Prod4|diff3"], "count" : 2}
 * {"tuples" : ["((sales))Prod1|((returns))Prod4|diff2"], "count" : 2}
 * {"tuples" : ["((sales))Prod2|((returns))Prod1|diff1"], "count" : 1}
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
            "all | list | range | any(wildcard, a purcahse of any kind) | anyof(or item1 or item2, etc)": {
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

TEMPLATES will be done in the future. This is just to validate the grammar
and approach

% of customers who bought product A and bought some product within 3 months
{
	"meta": "basket",
	"name" : "basketnew",
	"template": {
		"templatename" : "baskettemplate2",
		"variables": [
			{
				"($products$)" : [
					"Prod A"
				],
				"($numberof$)" : "3",
				"($periodscale$)" : "months",
				"($periodrange$)" : "within",
				"($support$)" : "0",
				"($confidence$)" : "0",
				"($lift$)" : "0",
				"($effectivefrom$)" : "xxx",
				"($effectiveuntil$)" : "xxx",
				"($description$)" : {
					"foward" : {
						"en-US" : [
							"($confidence$)% of customers who bought ($associate.items[0].value$) bought something else ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$). This scenario occurs ($support$)% of all transactions."
						],
					},
					"inverse" : {
					}
				},
				"($uniquefield$)" : "customer_id",
				"($from$)" : "sales.product_id",
				"($periodfield$)" : "sales.sales_date_ym",
				"($condition$)" : "exists"
			}
		]
	}

}

((sale))product_id

{
    "meta": "baskettemplate",
    "name": "baskettemplate2",
    "forbasket": {
        "description": "($description$)",
        "effectivefrom": "($effectivefrom$)",
        "effectiveuntil": "($effectiveuntil$)",
        "basketuniquefield": "($uniquefield$)",
        "support": "($support$)",
        "confidence": "($confidence$)",
        "lift": "($lift$)",
        "inverse" : "true,
        "associate": {
            "items": [
                {
                    "list": {
                        "from": "($from$)",
                        "values": "($products$)"
                    },
                    "where": {
                        "record": "($condition$)"
                    }
                }
            ]
        },
        "with": {
            "items": [
                {
                    "some": {
                        "from": "($from$)"
                    },
                    "where": {
                        "record": "($condition$)"
                    },
                    "timeframes": {
                        "from": "($periodfield$)",
                        "frames": [
                            {
                                "($periodrange$)": {
                                    "($numberof$)": "($periodscale$)"
                                }
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
    "name": "basket2",
    "forbasket": {
        "description": {
            "en-US": [
                "($confidence$)% of customers who bought ($associate.items[0].value$) also bought ($with.items[1].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"
            ]
        },
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield": "transaction_id",
        "support": "000",
        "confidence": "000",
        "lift": "000",
        "inverse" : "true",
        "associate": {
            "items": [
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
            "items": [
                {
                    "all": {
                        "from": "sales.product_id"
                    },
                    "where": {
                        "record": "exists"
                    }
                }
            ]
        }
    }
}

% of customers who bought a product and returned it within 6 months
{
    'meta': 'basket',
    'name': 'basket2',
    'forbasket': {
        'description': {
			'forward': {
				'en-US': [
					'($confidence$)% of customers who bought ($associate.items[0].value$) returned it ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)'
				]
			},
			'inverse' : {
			
			}
        },
        'effectivefrom': 'xxx',
        'effectiveuntil': 'xxx',
        'basketuniquefield': 'customer_id',
        'support': '000',
        'confidence': '000',
        'lift': '000',
        'inverse' : 'true',
        'associate': {
            'items': [
                {
                    'all': {
                        'from': 'sales.product_id'
                    },
                    'where': {
                        'record': 'exists'
                    }
                }
            ]
        },
        'with': {
            'items': [
                {
                    'same': {
                        'from': 'returns.product_id'
                    },
                    'where': {
                        'record': 'exists'
                    },
                    'timeframes': {
                        'from': 'sales.sales_date_ym',
                        'frames': [
                            {
                                'within': {
                                    '6': 'months'
                                }
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
    "name": "basket2",
    "forbasket": {
        "description": {
			"foward": {
				"en-US": [
					"($confidence$)% of customers who bought ($associate.items[0].value$) returned it ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"
				]
			},
			"inverse" : {
			
			}
        },
        "effectivefrom": "xxx",
        "effectiveuntil": "xxx",
        "basketuniquefield": "customer_id",
        "support": "000",
        "confidence": "000",
        "lift": "000",
        "inverse" : "true",
        "associate": {
            "items": [
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
            "items": [
                {
                    "same": {
                        "from": "returns.product_id"
                    },
                    "where": {
                        "record": "exists"
                    },
                    "timeframe": {
                        "from": "sales.sales_date_ym",
                        "frames": [
                            {
                                "after": {
                                    "3": "weeks"
                                }
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
    'meta': 'basket',
    'name': 'basket2',
    'forbasket': {
        'description': {
			'forward' : {
				'en-US': [
					'($confidence$)% of customers who bought ($associate.items[0].value$) and ($associate.items[1].value$) also bought ($with.items[0].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)'
				]
			},
			'inverse' : {
			
			}
        },
        'effectivefrom': 'xxx',
        'effectiveuntil': 'xxx',
        'basketuniquefield': 'transaction_id',
        'support': '000',
        'confidence': '000',
        'lift': '000',
        'inverse' : 'true',
        'associate': {
            'items': [
                {
                    'all': {
                        'from': 'sales.product_id'
                    },
                    'where': {
                        'record': 'exists'
                    }
                },
                {
                    'all': {
                        'from': 'sales.product_id'
                    },
                    'where': {
                        'record': 'exists'
                    }
                }
            ]
        },
        'with': {
            'items': [
                {
                    'all': {
                        'from': 'sales.product_id'
                    },
                    'where': {
                        'record': 'exists'
                    }
                }
            ]
        }
    }
}

*/			
	
 

