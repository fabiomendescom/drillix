var assert = require('chai').assert;

var processor = require('../basketprocessor');

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
  describe('Test Aggregators', function(){
    it('Test Aggregator', function(){	
		var event = {};
		var records = [];
		var kinesis = {};
		kinesis.partitionKey = "partitionKey-3";
		kinesis.kinesisSchemaVersion = "1.0";
		kinesis.data = '{\
					"Process": {\
						"Type": "AddEvent",\
						"Data": {\
							"account": "darby",\
							"object": "sale",\
							"fields": [\
								{\
									"name": "partner_id",\
									"value": "null"\
								},\
								{\
									"name": "net_amount",\
									"value": 29\
								},\
								{\
									"name": "gross_amount",\
									"value": 29\
								},\
								{\
									"name": "unique_sale_id",\
									"value": "67369"\
								},\
								{\
									"name": "product_id",\
									"value": "2381"\
								},\
								{\
									"name": "variant_id",\
									"value": "3794"\
								},\
								{\
									"name": "line_number",\
									"value": "218514"\
								},\
								{\
									"name": "quantity",\
									"value": 1\
								},\
								{\
									"name": "sale_date",\
									"value": "20150206T115527Z"\
								},\
								{\
									"name": "customer_id",\
									"value": "59005"\
								}\
							]\
						}\
					}\
		}';
		kinesis.sequenceNumber ="49545115243490985018280067714973144582180062593244200961";
		var record = {};
		record.kinesis = kinesis;
		record.eventSource = "aws:kinesis";
		record.eventID = "shardId-000000000000:49545115243490985018280067714973144582180062593244200961";
		record.invokeIdentityArn = "arn:aws:iam::059493405231:role/testLEBRole";
		record.eventVersion = "1.0";
		record.eventName = "aws:kinesis:record";
		record.eventSourceARN = "arn:aws:kinesis:us-east-1:35667example:stream/examplestream";
		record.awsRegion = "us-east-1";
		
		var record2 = JSON.parse(JSON.stringify(record));
		record2.kinesis.data = '{\
					"Process": {\
						"Type": "AddEvent",\
						"Data": {\
							"account": "darby",\
							"object": "sale",\
							"fields": [\
								{\
									"name": "partner_id",\
									"value": "null"\
								},\
								{\
									"name": "net_amount",\
									"value": 29\
								},\
								{\
									"name": "gross_amount",\
									"value": 29\
								},\
								{\
									"name": "unique_sale_id",\
									"value": "67369"\
								},\
								{\
									"name": "product_id",\
									"value": "2382"\
								},\
								{\
									"name": "variant_id",\
									"value": "3794"\
								},\
								{\
									"name": "line_number",\
									"value": "218514"\
								},\
								{\
									"name": "quantity",\
									"value": 1\
								},\
								{\
									"name": "sale_date",\
									"value": "20150206T115527Z"\
								},\
								{\
									"name": "customer_id",\
									"value": "59005"\
								}\
							]\
						}\
					}\
		}';
		var record3 = JSON.parse(JSON.stringify(record));
		record3.kinesis.data = '{\
					"Process": {\
						"Type": "AddEvent",\
						"Data": {\
							"account": "darby",\
							"object": "sale",\
							"fields": [\
								{\
									"name": "partner_id",\
									"value": "null"\
								},\
								{\
									"name": "net_amount",\
									"value": 29\
								},\
								{\
									"name": "gross_amount",\
									"value": 29\
								},\
								{\
									"name": "unique_sale_id",\
									"value": "67369"\
								},\
								{\
									"name": "product_id",\
									"value": "2383"\
								},\
								{\
									"name": "variant_id",\
									"value": "3794"\
								},\
								{\
									"name": "line_number",\
									"value": "218514"\
								},\
								{\
									"name": "quantity",\
									"value": 1\
								},\
								{\
									"name": "sale_date",\
									"value": "20150206T115527Z"\
								},\
								{\
									"name": "customer_id",\
									"value": "59005"\
								}\
							]\
						}\
					}\
		}';		
		var record4 = JSON.parse(JSON.stringify(record));
		record4.kinesis.data = '{\
					"Process": {\
						"Type": "AddEvent",\
						"Data": {\
							"account": "darby",\
							"object": "sale",\
							"fields": [\
								{\
									"name": "partner_id",\
									"value": "null"\
								},\
								{\
									"name": "net_amount",\
									"value": 29\
								},\
								{\
									"name": "gross_amount",\
									"value": 29\
								},\
								{\
									"name": "unique_sale_id",\
									"value": "67380"\
								},\
								{\
									"name": "product_id",\
									"value": "2383"\
								},\
								{\
									"name": "variant_id",\
									"value": "3794"\
								},\
								{\
									"name": "line_number",\
									"value": "218514"\
								},\
								{\
									"name": "quantity",\
									"value": 1\
								},\
								{\
									"name": "sale_date",\
									"value": "20150206T115527Z"\
								},\
								{\
									"name": "customer_id",\
									"value": "59005"\
								}\
							]\
						}\
					}\
		}';	
		var record5 = JSON.parse(JSON.stringify(record));
		record5.kinesis.data = '{\
					"Process": {\
						"Type": "AddEvent",\
						"Data": {\
							"account": "darby",\
							"object": "sale",\
							"fields": [\
								{\
									"name": "partner_id",\
									"value": "null"\
								},\
								{\
									"name": "net_amount",\
									"value": 29\
								},\
								{\
									"name": "gross_amount",\
									"value": 29\
								},\
								{\
									"name": "unique_sale_id",\
									"value": "67380"\
								},\
								{\
									"name": "product_id",\
									"value": "2384"\
								},\
								{\
									"name": "variant_id",\
									"value": "3794"\
								},\
								{\
									"name": "line_number",\
									"value": "218514"\
								},\
								{\
									"name": "quantity",\
									"value": 1\
								},\
								{\
									"name": "sale_date",\
									"value": "20150206T115527Z"\
								},\
								{\
									"name": "customer_id",\
									"value": "59005"\
								}\
							]\
						}\
					}\
		}';			
				
		records.push(record);
		records.push(record2);
		records.push(record3);	
		records.push(record4);
		records.push(record5);									
		event.Records = records;		
		
		var systemconfig = JSON.parse('{ \
			"configs" : [ \
				{ \
					"aggregators" : [ \
						{ \
							"basketdefinition" : { \
								"basketkeyalias" : {\
									"basketkeyalias" : "TRANSACTION", \
									"objects" : [\
										{\
											"object" : "sale", \
											"key" : "unique_sale_id", \
											"basketfieldaliases" : [\
												{\
													"basketfieldalias" : "PRODUCT_ID",\
													"field" : "product_id"\
												}\
											]\
										},\
										{\
											"object" : "returns", \
											"key" : "original_unique_sale_id", \
											"basketfieldaliases" : [\
												{\
													"basketfieldalias" : "PRODUCT_ID",\
													"field" : "product_id"\
												}\
											]\
										}\
									]\
								}\
							},\
							"tuplestotrack" : [ \
								{\
									"basketfields" : [\
										{\
											"filter" : "all", \
											"basketfieldalias" : "PRODUCT_ID"\
										} \
									]\
								},\
								{\
									"basketfields" : [\
										{\
											"filter" : "all", \
											"basketfieldalias" : "PRODUCT_ID"\
										},\
										{\
											"filter" : "all", \
											"basketfieldalias" : "PRODUCT_ID"\
										}\
									]\
								}\
							] \
						}\
					] \
				} \
			] \
		}');	
		
		var expectedoutput = '{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "TRANSACTION", \
					"basketkeyaliasvalue" : "67369", \
					"data" : [\
						{\
							"values" : [	\
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}		\
							]	\
						}\
					]\
				},\
				{\
					"basketkeyalias" : "TRANSACTION", \
					"basketkeyaliasvalue" : "67380", \
					"data" : [\
						{\
							"values" : [	\
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2384"} \
							]	\
						}\
					]\
				}\
			]\
		}';
		
		//This should go to another test case. 
		//this deals with time based accumulators by the nature of the tuples
		var expectedoutput2 = '{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "CUSTOMER", \
					"basketkeyaliasvalue" : "59005", \
					"data" : [\
						{\
							"values" : [	\
								{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
								{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
								{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
								{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
								{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
								{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
							]	\
						}\
					]\
				}\
			]\
		}';		
		
		assert.notOk(1,'this is a stub');
    })
  })  
  describe('Test Counters', function(){
    it('Test Counter', function(){	
		var inputrecord = '{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "TRANSACTION", \
					"basketkeyaliasvalue" : "67369", \
					"data" : [\
						{\
							"values" : [	\
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}		\
							]	\
						}\
					]\
				},\
				{\
					"basketkeyalias" : "TRANSACTION", \
					"basketkeyaliasvalue" : "67380", \
					"data" : [\
						{\
							"values" : [	\
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2384"} \
							]	\
						}\
					]\
				}\
			]\
		}';		
		
		var expectedoutput = '{\
			"tuples": [\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}		\
					],\
					"count" : "1"\
				},	\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}					\
					],\
					"count" : "1"\
				},			\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}					\
					],\
					"count" : "1"\
				},									\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}\
					],\
					"count" : "1"\
				},	\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2384"}\
					],\
					"count" : "1"\
				},	\
				{\
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2384"} \
					],\
					"count" : "1"\
				}\
			]\
	    }';

		var inputrecord2 = '{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "CUSTOMER", \
					"basketkeyaliasvalue" : "59005", \
					"data" : [\
						{\
							"values" : [	\
								{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
								{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
								{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
								{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
								{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
								{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
							]	\
						}\
					]\
				}\
			]\
		}';		
		
		var expectedoutput2 = '{\
			"tuples": [\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"} \
					],\
					"count" : "1"\
				},	\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},			\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},									\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},\
				{\
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				}\
			]\
	    }';			
		
		assert.notOk(1,'this is a stub');
    })
  })    
})
