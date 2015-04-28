var assert = require('chai').assert;

var processor = require('../bucketProcessor');

describe('Basket Processor Test', function(){
  before(function() {
		var inputtransaction1 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1808"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction2 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1809"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction3 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1810"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction4 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1810"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 


		//% of customers who bought product A and bought some product within 3 months TEMPLATE VARIABLES
		var template1 = JSON.parse('{\
			"meta": "basket",\
			"name" : "basketnew",\
			"template": {\
				"templatename" : "baskettemplate2",\
				"variables": [\
					{\
						"($products$)" : [\
							"Prod A"\
						],\
						"($numberof$)" : "3",\
						"($periodscale$)" : "months",\
						"($periodrange$)" : "within",\
						"($support$)" : "0",\
						"($confidence$)" : "0",\
						"($lift$)" : "0",\
						"($effectivefrom$)" : "xxx",\
						"($effectiveuntil$)" : "xxx",\
						"($description$)" : {\
							"forward" : {\
								"en-US" : [\
									"($confidence$)% of customers who bought ($associate.items[0].value$) bought something else ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$). This scenario occurs ($support$)% of all transactions."\
								]\
							},\
							"inverse" : {\
							}\
						},\
						"($uniquefield$)" : "customer_id",\
						"($from$)" : "sales.product_id",\
						"($periodfield$)" : "sales.sales_date_ym",\
						"($condition$)" : "exists"\
					}\
				]\
			}\
		}');




		//% of customers who bought a product and returned it within 6 months		
		var userconfig2 = JSON.parse('{\
			"meta": "basket",\
			"name": "basket2",\
			"forbasket": {\
				"description": {\
					"forward": {\
						"en-US": [\
							"($confidence$)% of customers who bought ($associate.items[0].value$) returned it ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"\
						]\
					},\
					"inverse" : {\
					}\
				},\
				"effectivefrom": "xxx",\
				"effectiveuntil": "xxx",\
				"basketuniquefield": "customer_id",\
				"support": "000",\
				"confidence": "000",\
				"lift": "000",\
				"inverse" : "true",\
				"associate": {\
					"items": [\
						{\
							"all": {\
								"from": "sales.product_id"\
							}\
						}\
					]\
				},\
				"with": {\
					"items": [\
						{\
							"same": {\
								"from": "returns.product_id"\
							},\
							"timeframes": {\
								"from": "sales.sales_date_ym",\
								"frames": [\
									{\
										"within": {\
											"6": "months"\
										}\
									}\
								]\
							}\
						}\
					]\
				}\
			}\
		}');
		
		//Customers who bought prod x and prod y also buy prod z
		var userconfig3 = JSON.parse('{\
			"meta": "basket",\
			"name": "basket2",\
			"forbasket": {\
				"description": {\
					"forward" : {\
						"en-US": [\
							"($confidence$)% of customers who bought ($associate.items[0].value$) and ($associate.items[1].value$) also bought ($with.items[0].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"\
						]\
					},\
					"inverse" : {\
					}\
				},\
				"effectivefrom": "xxx",\
				"effectiveuntil": "xxx",\
				"basketuniquefield": "transaction_id",\
				"support": "000",\
				"confidence": "000",\
				"lift": "000",\
				"inverse" : "true",\
				"associate": {\
					"items": [\
						{\
							"all": {\
								"from": "sales.product_id"\
							},\
							"where": {\
								"record": "exists"\
							}\
						},\
					{\
							"all": {\
								"from": "sales.product_id"\
							},\
							"where": {\
								"record": "exists"\
							}\
						}\
					]\
				},\
				"with": {\
					"items": [\
						{\
							"all": {\
								"from": "sales.product_id"\
							},\
							"where": {\
								"record": "exists"\
							}\
						}\
					]\
				}\
			}\
		}');

		//this structure allows the system to know how to accumulate the fields into a "transaction" that will be used for
		//the basket analysis
		var systemconfig1 = JSON.parse('{ \
			"configs" : [ \
				{ \
					"object" : "sale", \
					"basketkey" : "unique_sale_id", \
					"accumulators" : [ \
						{ \
							"timebased" : "0", \
							"fieldstotrack" : [ \
								"product_id" \
							] \
						}, \
						{ \
							"timebased" : "1", \
							"timetype" : "month", \
							"timefield" : "sale_date_ym", \
							"fieldstotrack" : [ \
								"product_id" \
							] \
						} \
					] \
				} \
			] \
		}');
		
		var basketaccumulatorsoutput1 = JSON.parse('{ \
			"accumulators" : [ \
				{ \
					"object" : "sale", \
					"basketkey" : "unique_sale_id", \
					"basketkeyvalue" : "T100", \
					"fields": [ \
						{ \
							"field" : "product_id", \
							"value" : "1808" \
						}, \
						{ \
							"field" : "product_id", \
							"value" : "1809" \
						}, \
						{ \
							"field" : "product_id", \
							"value" : "1810" \
						} \
					] \
				} \
			] \
		}');
		
		var basketcounteroutput1 = JSON.parse('{\
			"counters": [ \
				{ \
					"tuple" : [ \
						{ \
							"object" : "sale", \
							"field" : "product_id", \
							"value" : "1808" \
						}, \
						{ \
							"object" : "sale", \
							"field" : "product_id", \
							"value" : "1809" \
						} \
					], \
					"count" : "1" \
				} \
			] \
		}');


  })	
 /*   
  describe('Test Template to User Config conversions - TBD', function(){
    it('Converts a template into a User Config', function(){	
		assert.ok(1,'this is a stub. You need to finish this template later');
    })
  })
  describe('Test User Config to System Config conversions - TBD', function(){
    it('Converts a User Config to System Config', function(){	
		//% of customers who bought 2 products together
		var userconfig = JSON.parse('{\
			"meta": "basket",\
			"name": "basket2",\
			"forbasket": {\
				"description": {\
					"forward": {\
						"en-US": [\
							"($confidence$)% of customers who bought ($associate.items[0].value$) also bought ($with.items[1].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)"\
						]\
					},\
					"inverse" : {\
					}\
				},\
				"effectivefrom": "xxx",\
				"effectiveuntil": "xxx",\
				"basketuniquefield": "unique_sale_id",\
				"support": "000",\
				"confidence": "000",\
				"lift": "000",\
				"inverse" : "true",\
				"associate": {\
					"items": [\
						{\
							"all": {\
								"from": "sale.product_id"\
							}\
						}\
					]\
				},\
				"with": {\
					"items": [\
						{\
							"all": {\
								"from": "sale.product_id"\
							}\
						}\
					]\
				}\
			}\
		}');	
		var inputdata = [];
		inputdata.push(userconfig);
		
		var expectedresult = JSON.parse('{ \
			"configs" : [ \
				{ \
					"object" : "sale", \
					"basketkey" : "unique_sale_id", \
					"accumulators" : [ \
						{ \
							"timebased" : "0", \
							"tuplestotrack" : [ \
								{\
									"fields" : [\
										{\
											"filter" : "all", \
											"field" : "product_id"\
										} \
									]\
								},\
								{\
									"fields" : [\
										{\
											"filter" : "all", \
											"field" : "product_id"\
										},\
										{\
											"filter" : "all", \
											"field" : "product_id"\
										}\
									]\
								}\
							] \
						}\
					] \
				} \
			] \
		}');	
		
		//assert.equal(expectedresult, processor.convertUserConfigToSystemConfig(inputdata));
		assert.equal(1,1);
		//this will be finished later.
				
    })
  })  
*/

/*
 
{
	"set" : {
		"fieldinstanceid" : "1",\
		"fieldname" : "product_id"\
	}
} 
 
*/
  describe('Test Aggregators', function(){

	it('Enrich Transaction', function() {

		var record1 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67369",\
									"product_id" : "2381",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"customer_id":"59005"\
							}\
		}');
		
		var record2  = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67369",\
									"product_id" : "2382",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"customer_id":"59005"\
							}\
		}');		

		var record3 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67369",\
									"product_id" : "2383",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"customer_id":"59005"\
							}\
		}');	
		
		var record4 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67380",\
									"product_id" : "2383",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"customer_id":"59005"\
							}\
		}');	
		
		var record5 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67380",\
									"product_id" : "2384",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"customer_id":"59005"\
							}\
		}');	
		
		var addtransactionrecords = [];		
		addtransactionrecords.push(record1);
		addtransactionrecords.push(record2);
		addtransactionrecords.push(record3);
		addtransactionrecords.push(record4);
		addtransactionrecords.push(record5);

		var outrecord1 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67369",\
									"product_id" : "2381",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"sale_date_ym": "2015/02",\
									"customer_id":"59005"\
							}\
		}');
		
		var outrecord2  = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67369",\
									"product_id" : "2382",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"sale_date_ym": "2015/02",\
									"customer_id":"59005"\
							}\
		}');		

		var outrecord3 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67369",\
									"product_id" : "2383",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"sale_date_ym": "2015/02",\
									"customer_id":"59005"\
							}\
		}');	
		
		var outrecord4 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67380",\
									"product_id" : "2383",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"sale_date_ym": "2015/02",\
									"customer_id":"59005"\
							}\
		}');	
		
		var outrecord5 = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67380",\
									"product_id" : "2384",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"sale_date_ym": "2015/02",\
									"customer_id":"59005"\
							}\
		}');	
		
		var outaddtransactionrecords = [];		
		outaddtransactionrecords.push(outrecord1);
		outaddtransactionrecords.push(outrecord2);
		outaddtransactionrecords.push(outrecord3);
		outaddtransactionrecords.push(outrecord4);
		outaddtransactionrecords.push(outrecord5);
			
		// We need some kind of config file for enrichment....		

	});	

	it('getHighestTupleSize', function() {

		var associationconfig1 = JSON.parse('{\
			"tuplesize": "2",\
			"associationconditions" : [\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				}\
			],\
			"then" : {\
				"bucket" : {\
					"keys" : [	\
						{\
							"field" : "CUSTOMER_ID", \
							"value": "<<$.buckets[0].bucket.keys[0].value>>" \
						},\
						{\
							"field" : "DATE_OF_SALE", \
							"value" : "<<$.buckets[0].bucket.keys[1].value>>" \
						}\
					],\
					"items" : [\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[0].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						},\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[1].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						}\
					],\
					"aggregations": [\
						{\
							"type" : "count",\
							"value" : 1\
						}\
					]\
				}\
			}\
		}');	
		
		var associationconfig2 = JSON.parse('{\
			"tuplesize": "2",\
			"associationconditions" : [\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				}\
			],\
			"then" : {\
				"bucket" : {\
					"keys" : [	\
						{\
							"field" : "CUSTOMER_ID", \
							"value": "<<$.buckets[0].bucket.keys[0].value>>" \
						},\
						{\
							"field" : "DATE_OF_SALE", \
							"value" : "<<$.buckets[0].bucket.keys[1].value>>" \
						}\
					],\
					"items" : [\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[0].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						},\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[1].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						}\
					],\
					"aggregations": [\
						{\
							"type" : "count",\
							"value" : 1\
						}\
					]\
				}\
			}\
		}');	
		
		var associationconfig3 = JSON.parse('{\
			"tuplesize": 5,\
			"associationconditions" : [\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				}\
			],\
			"then" : {\
				"bucket" : {\
					"keys" : [	\
						{\
							"field" : "CUSTOMER_ID", \
							"value": "<<$.buckets[0].bucket.keys[0].value>>" \
						},\
						{\
							"field" : "DATE_OF_SALE", \
							"value" : "<<$.buckets[0].bucket.keys[1].value>>" \
						}\
					],\
					"items" : [\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[0].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						},\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[1].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						}\
					],\
					"aggregations": [\
						{\
							"type" : "count",\
							"value" : 1\
						}\
					]\
				}\
			}\
		}');					
		
		var associationconfigarray = [];
		associationconfigarray.push(associationconfig1);		
		associationconfigarray.push(associationconfig2);	
		associationconfigarray.push(associationconfig3);

		var output = processor.getHighestTupleSize(associationconfigarray);
		assert.deepEqual(output,5);			
							
	});

	it('createSubsetsOfSize', function() {
		var bucketoutput1 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID",\
						"values" : [\
							{\
								"value" : "2381",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');	
		
		var bucketoutput2 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PARTNER_ID",\
						"values" : [\
							{\
								"value" : "null",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "IS"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');	
		
		var bucketoutput3 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID",\
						"values" : [\
							{\
								"value" : "2380",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');
		
		var bucketoutput4 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID",\
						"values" : [\
							{\
								"value" : "2383",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');						
		
		var bucketoutputarray = [];
		bucketoutputarray.push(bucketoutput1);		
		bucketoutputarray.push(bucketoutput2);		
		bucketoutputarray.push(bucketoutput3);		
		bucketoutputarray.push(bucketoutput4);		
		
		var expectedresult = JSON.parse('\
[\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2381",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PARTNER_ID",\
                            "values": [\
                                {\
                                    "value": "null",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "IS"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2380",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    },\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2381",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PARTNER_ID",\
                            "values": [\
                                {\
                                    "value": "null",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "IS"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2383",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    },\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2381",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2380",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2383",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    },\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PARTNER_ID",\
                            "values": [\
                                {\
                                    "value": "null",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "IS"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2380",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2383",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    }\
]');
		

		var output = processor.createSubsetsOfSize(bucketoutputarray, 3);
		//console.log(JSON.stringify(output));
		assert.deepEqual(output,expectedresult);			
					
	});

	it('Buckets - createBuckets', function() {

		var record = JSON.parse('{\
							"account": "darby",\
							"object": "sale",\
							"fields": {\
									"partner_id" : "null",\
									"net_amount" : "29",\
									"gross_amount" : "29",\
									"unique_sale_id" : "67369",\
									"product_id" : "2381",\
									"variant_id": "3794",\
									"line_number" : "218514",\
									"quantity": "1",\
									"sale_date": "20150206T115527Z",\
									"sale_date_ym": "2015/02",\
									"customer_id":"59005"\
							}\
		}');
		
				
		var buckettemplate1 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "<<$.fields.customer_id>>" \
					},\
					{\
						"field" : "DATE_OF_SALE", \
						"value" : "<<$.fields.sale_date_ym>>" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID", \
						"values" : [ \
							{\
								"value" : "<<$.fields.product_id>>",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "<<$.fields.sale_date>>" \
					}\
				]	\
			}\
		}');
		
		var buckettemplate2 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "<<$.fields.customer_id>>" \
					},\
					{\
						"field" : "DATE_OF_SALE", \
						"value" : "<<$.fields.sale_date_ym>>" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PARTNER_ID", \
						"values" : [ \
							{\
								"value" : "<<$.fields.partner_id>>",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "IS"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "<<$.fields.sale_date>>" \
					}\
				]	\
			}\
		}');	
		
		var templatelist = [];
		templatelist.push(buckettemplate1);
		templatelist.push(buckettemplate2);	
		
		var bucketoutput1 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID",\
						"values" : [\
							{\
								"value" : "2381",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');	
		
		var bucketoutput2 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PARTNER_ID",\
						"values" : [\
							{\
								"value" : "null",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "IS"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');	
		
		var bucketoutputarray = [];
		bucketoutputarray.push(bucketoutput1);		
		bucketoutputarray.push(bucketoutput2);					
		
		var output = processor.createBuckets(record, templatelist);
		assert.deepEqual(output,bucketoutputarray);	
		
	});

	it('Buckets - createBucketTuples', function() {
		
		var associationconfig = JSON.parse('{\
			"tuplesize": 2,\
			"associationconditions" : [\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				}\
			],\
			"then" : {\
				"bucket" : {\
					"keys" : [	\
						{\
							"field" : "CUSTOMER_ID", \
							"value": "<<$.buckets[0].bucket.keys[0].value>>" \
						},\
						{\
							"field" : "DATE_OF_SALE", \
							"value" : "<<$.buckets[0].bucket.keys[1].value>>" \
						}\
					],\
					"items" : [\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[0].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						},\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[1].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						}\
					],\
					"aggregations": [\
						{\
							"type" : "count",\
							"value" : 1\
						}\
					]\
				}\
			}\
		}');	
		
		var associationconfigarray = [];
		associationconfigarray.push(associationconfig);
		
		var bucketoutput1 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID",\
						"values" : [\
							{\
								"value" : "2381",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');	
		
		var bucketoutput2 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PARTNER_ID",\
						"values" : [\
							{\
								"value" : "null",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "IS"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');	
		
		var bucketoutput3 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID",\
						"values" : [\
							{\
								"value" : "2380",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');
		
		var bucketoutput4 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "59005"\
					},\
					{\
						"field" : "DATE_OF_SALE",\
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID",\
						"values" : [\
							{\
								"value" : "2383",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				],\
				"tags" : [\
					{\
						"tag" : "transactiondate", \
						"value" : "20150206T115527Z" \
					}\
				]	\
			}\
		}');						
		
		var bucketoutputarray = [];
		bucketoutputarray.push(bucketoutput1);		
		bucketoutputarray.push(bucketoutput2);		
		bucketoutputarray.push(bucketoutput3);		
		bucketoutputarray.push(bucketoutput4);		
		
		var expectedresult = JSON.parse('\
[\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2381",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PARTNER_ID",\
                            "values": [\
                                {\
                                    "value": "null",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "IS"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2380",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    },\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2381",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PARTNER_ID",\
                            "values": [\
                                {\
                                    "value": "null",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "IS"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2383",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    },\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2381",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2380",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2383",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    },\
    {\
        "tuple": [\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PARTNER_ID",\
                            "values": [\
                                {\
                                    "value": "null",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "IS"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2380",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            },\
            {\
                "bucket": {\
                    "keys": [\
                        {\
                            "field": "CUSTOMER_ID",\
                            "value": "59005"\
                        },\
                        {\
                            "field": "DATE_OF_SALE",\
                            "value": "2015/02"\
                        }\
                    ],\
                    "items": [\
                        {\
                            "field": "PRODUCT_ID",\
                            "values": [\
                                {\
                                    "value": "2383",\
                                    "tags": [\
                                        {\
                                            "tag": "verb",\
                                            "value": "BUY"\
                                        }\
                                    ]\
                                }\
                            ]\
                        }\
                    ],\
                    "aggregations": [\
                        {\
                            "type": "count",\
                            "value": 1\
                        }\
                    ],\
                    "tags": [\
                        {\
                            "tag": "transactiondate",\
                            "value": "20150206T115527Z"\
                        }\
                    ]\
                }\
            }\
        ]\
    }\
]');
		

		var output = processor.createBucketTuples(bucketoutputarray,associationconfigarray);
		assert.deepEqual(output,expectedresult);	
				
	});

	it('Buckets - createAssociatedBucketTuples', function() {

/*
			"constraints" : [
				{
					"comparsionfield" : "$.buckets[0].bucket.keys[0].value",
					"comparisonoperator" : "in",
					"comparisonvalue" : [
						"5009"
					]
				}
			],
*/

		var associationconfig = JSON.parse('{\
			"tuplesize": "2",\
			"associationconditions" : [\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.keys[0].field>>",\
					"with" : "CUSTOMER_ID"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.keys[0].value>>",\
					"with" : "<<$.buckets[1].bucket.keys[0].value>>"\
				},\
				{\
					"match" : "<<$.buckets[0].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				},\
				{\
					"match" : "<<$.buckets[1].bucket.items[0].field>>",\
					"with" : "PRODUCT_ID"\
				}\
			],\
			"then" : {\
				"bucket" : {\
					"keys" : [	\
						{\
							"field" : "CUSTOMER_ID", \
							"value": "<<$.buckets[0].bucket.keys[0].value>>" \
						},\
						{\
							"field" : "DATE_OF_SALE", \
							"value" : "<<$.buckets[0].bucket.keys[1].value>>" \
						}\
					],\
					"items" : [\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[0].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						},\
						{\
							"field" : "PRODUCT_ID", \
							"values" : [ \
								{\
									"value" : "<<$.buckets[1].bucket.items[0].values[0].value>>",\
									"tags" : [\
										{\
											"tag" : "verb",\
											"value" : "BUY"\
										}\
									]\
								}\
							] \
						}\
					],\
					"aggregations": [\
						{\
							"type" : "count",\
							"value" : 1\
						}\
					]\
				}\
			}\
		}');	
		
		var associationconfigarray = [];
		associationconfigarray.push(associationconfig);
				
		var tuple = JSON.parse('{\
			"tuple": {\
					"size": "2",\
					"buckets" : []\
			}\
		}');
		
		var bucket1 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "6099" \
					},\
					{\
						"field" : "DATE_OF_SALE", \
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID", \
						"values" : [ \
							{\
								"value" : "PROD_A",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				]\
			}\
		}');
		
		var bucket2 = JSON.parse('{\
			"bucket" : {\
				"keys" : [	\
					{\
						"field" : "CUSTOMER_ID", \
						"value": "6099" \
					},\
					{\
						"field" : "DATE_OF_SALE", \
						"value" : "2015/02" \
					}\
				],\
				"items" : [\
					{\
						"field" : "PRODUCT_ID", \
						"values" : [ \
							{\
								"value" : "PROD_B",\
								"tags" : [\
									{\
										"tag" : "verb",\
										"value" : "BUY"\
									}\
								]\
							}\
						] \
					}\
				],\
				"aggregations": [\
					{\
						"type" : "count",\
						"value" : 1\
					}\
				]\
			}\
		}');		
		
		var bucketlist = {};
		tuple.tuple.buckets.push(bucket1);
		tuple.tuple.buckets.push(bucket2);
		bucketlist.tuples = [];
		bucketlist.tuples.push(tuple);		
		
		var expected = JSON.parse('{\
			"associatedtuples":[\
				{"bucket":\
					{\
						"keys":[\
							{\
								"field":"CUSTOMER_ID",\
								"value":"6099"\
							},\
							{\
								"field":"DATE_OF_SALE",\
								"value":"2015/02"\
							}\
						],\
						"items":[\
							{\
								"field":"PRODUCT_ID",\
								"values":[\
									{\
										"value":"PROD_A",\
										"tags":[\
											{\
												"tag":"verb",\
												"value":"BUY"\
											}\
										]\
									}\
								]\
							},\
							{\
								"field":"PRODUCT_ID",\
								"values":[\
									{\
										"value":"PROD_B",\
										"tags":[\
											{\
												"tag":"verb",\
												"value":"BUY"\
											}\
										]\
									}\
								]\
							}\
						],\
						"aggregations":[\
							{\
								"type":"count",\
								"value":1\
							}\
						]\
					}\
				}\
			]\
		}');
		
		var output = processor.createAssociatedBucketTuples(bucketlist, associationconfigarray);
		//console.log(JSON.stringify(output));
		assert.deepEqual(output,expected);	
				
	});


  })
})
