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

  describe('Test Aggregators', function(){
	it('validateSystemConfig: normal flow. Valid', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						},\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "within", \
							"offset" : "6"\
						}\
					]\
				}\
			]\
		}');	
		
		var expectedresult = [];
		
		var validation = processor.validateSystemConfig(systemconfig);
		assert.deepEqual(validation,expectedresult);
	})		 
	
	it('validateSystemConfig: No "mappings"', function() {
		var systemconfig = JSON.parse('{ \
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						},\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "within", \
							"offset" : "6"\
						}\
					]\
				}\
			]\
		}');	
		
		var expectedresult = ["Config does not have a 'mappings' property"];
		
		var validation = processor.validateSystemConfig(systemconfig);

		assert.deepEqual(validation,expectedresult);
	})	
	
	it('validateSystemConfig: No "tuples"', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			]\
		}');		
		
		var expectedresult = ["Config does not have a 'tuples' property"];
		
		var validation = processor.validateSystemConfig(systemconfig);

		assert.deepEqual(validation,expectedresult);
	})			

	it('validateSystemConfig: "mappings" not an array', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : \
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				},\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						},\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "within", \
							"offset" : "6"\
						}\
					]\
				}\
			]\
		}');			
		
		var expectedresult = ["'mappings' property must be an array"];
		
		var validation = processor.validateSystemConfig(systemconfig);

		assert.deepEqual(validation,expectedresult);
	})		
		  
	it('validateSystemConfig: tuples must be an array', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			],\
			"tuples" : \
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				}\
		}');	
		
		var expectedresult = ["'tuples' property must be an array"];
		
		var validation = processor.validateSystemConfig(systemconfig);
		assert.deepEqual(validation,expectedresult);
	})		
	
	it('validateSystemConfig: "mappings" is empty ', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						},\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "within", \
							"offset" : "6"\
						}\
					]\
				}\
			]\
		}');	
		
		var expectedresult = ["'mappings' array must not be empty"];
		
		var validation = processor.validateSystemConfig(systemconfig);
		assert.deepEqual(validation,expectedresult);
	})		

	it('validateSystemConfig: "tuples" must not be empty', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			],\
			"tuples" : [\
			]\
		}');	
		
		var expectedresult = ["'tuples' array must not be empty"];
		
		var validation = processor.validateSystemConfig(systemconfig);
		assert.deepEqual(validation,expectedresult);
	})	
	
	it('validateSystemConfig: Object fields must not be empty', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						},\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "within", \
							"offset" : "6"\
						}\
					]\
				}\
			]\
		}');	
		
		var expectedresult = ["'objectfields' must not be empty in 'mappings' at index 0"];
		
		var validation = processor.validateSystemConfig(systemconfig);
		assert.deepEqual(validation,expectedresult);
	})				
	
	it('validateSystemConfig: Basketfields empty', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
					]\
				}\
			]\
		}');	
		
		var expectedresult = ["'basketfields' array must not be empty from tuple at index 1"];
		
		var validation = processor.validateSystemConfig(systemconfig);
		assert.deepEqual(validation,expectedresult);
	})				  

	it('validateSystemConfig: Invalid offset type', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						},\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "WRONG", \
							"offset" : "6"\
						}\
					]\
				}\
			]\
		}');	
		
		var expectedresult = ["Invalid offset type at index 1"];
		
		var validation = processor.validateSystemConfig(systemconfig);
		assert.deepEqual(validation,expectedresult);
	})	

/*
 * 
 */		  
		  
	it('getMapping: normal operation', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "unique_sale_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "TRANSACTION_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
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
			]\
		}');	
		
		var expectedresultvalidation = [];
		var validateresult = processor.validateSystemConfig(systemconfig);
		
		assert.deepEqual(validateresult,expectedresultvalidation);
		
		var mapping = processor.getMapping("sale", systemconfig);	
		
		var expectedresult = JSON.parse('{\
			"object":"sale",\
			"objectkey":"unique_sale_id",\
			"objectperiodrelevance":"sale_date",\
			"basketname":"SALES",\
			"basketaction":"BUY",\
			"basketkeyalias":"TRANSACTION_ID",\
			"objectfields":[\
				{"fieldname":"product_id","basketfieldname":"PRODUCT_ID"}\
			]\
		}');	
		
		assert.deepEqual(mapping,expectedresult);
	})  
	
	it('getDataForTransactionId: does not find data to get and creates one', function() {

		var aggregator = JSON.parse('{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				}\
			]\
		}');		

		var output = processor.getDataForTransactionId("DATANOTFOUND","unique_sale_id", "2015/02", aggregator);
		
		var expectedoutput = JSON.parse('{\
			"basketkeyalias":"DATANOTFOUND",\
			"basketkeyaliasvalue":"unique_sale_id",\
			"periodrelevance":"2015/02",\
			"data":[\
			]\
		}');
		
		assert.deepEqual(output,expectedoutput);
		
	})			

	it('addToAggregator: item already exists', function() {
		var item = 	JSON.parse('{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
		}');
						
		var aggregator1 = JSON.parse('[\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				}\
		]');	
		var aggregator2 = JSON.parse('[\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				}\
		]');	
				
		processor.addToAggregator(item,aggregator1);	
		
		assert.deepEqual(aggregator1,aggregator2);
				
	})	

	it('addToAggregator: item does not exist', function() {
		var item = 	JSON.parse('{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "NEWTRANSNUMBER", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383x"}  \
					]\
		}');
						
		var aggregator1 = JSON.parse('[\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				}\
		]');	
		var aggregator2 = JSON.parse('[\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				},\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "NEWTRANSNUMBER", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383x"}  \
					]\
				}\
		]');	
				
		processor.addToAggregator(item,aggregator1);	
		
		assert.deepEqual(aggregator1,aggregator2);
				
	})	
			
	it('getDataForTransactionId: finds the data in aggregator', function() {

		var aggregator = JSON.parse('{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "TRANSACTION_IDxx", \
					"basketkeyaliasvalue" : "67369x", \
					"periodrelevance" : "2015/01", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383x"}  \
					]\
				},\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				},\
				{\
					"basketkeyalias" : "TRANSACTION_IDxxx", \
					"basketkeyaliasvalue" : "67369r", \
					"periodrelevance" : "2015/03", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382x"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383x"}  \
					]\
				}\
			]\
		}');		

		var output = processor.getDataForTransactionId("TRANSACTION_ID","unique_sale_id", "2015/02", aggregator);
		
		var expectedoutput = JSON.parse('{\
			"basketkeyalias":"TRANSACTION_ID",\
			"basketkeyaliasvalue":"unique_sale_id",\
			"periodrelevance":"2015/02",\
			"data":[\
			]\
		}');
		
		assert.deepEqual(output,expectedoutput);
		
	})				

	it('getMapping: null values', function() {
		var mapping = null;	
		var expectedresult = null;
		assert.deepEqual(mapping,expectedresult);
	})	
	
	it('getObjectField: normal flow', function() {
		
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID",\
							"timebaseditems" : [\
								{\
									"periodtype" : "month",\
									"offset" : "6"\
								}\
							]\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
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
			]\
		}');	
		
		var expectedresultvalidation = [];
		var validateresult = processor.validateSystemConfig(systemconfig);
		
		assert.deepEqual(validateresult,expectedresultvalidation);		
		
		expectedresult = JSON.parse('{\
			"fieldname":"product_id",\
			"basketfieldname":"PRODUCT_ID",\
			"timebaseditems":[\
				{\
					"periodtype":"month",\
					"offset":"6"\
				}\
			]\
		}');
		
		var result = processor.getObjectField("sale","PRODUCT_ID",systemconfig);
		 
		assert.deepEqual(result,expectedresult);
	})		
			
    it('runAggregator: Normal aggregation', function(){	
		/*
		var event = {};
		var records = [];
		var kinesis = {};
		kinesis.partitionKey = "partitionKey-3";
		kinesis.kinesisSchemaVersion = "1.0";

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

		var record3 = JSON.parse(JSON.stringify(record));
	
		var record4 = JSON.parse(JSON.stringify(record));

		var record5 = JSON.parse(JSON.stringify(record));
		
				
		records.push(record);
		records.push(record2);
		records.push(record3);	
		records.push(record4);
		records.push(record5);									
		event.Records = records;		
		*/

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

		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "unique_sale_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "TRANSACTION_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID"\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
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
			]\
		}');
		
		var expectedresultvalidation = [];
		var validateresult = processor.validateSystemConfig(systemconfig);
		
		assert.deepEqual(validateresult,expectedresultvalidation);				
				
		var expectedoutput = JSON.parse('{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				},\
				{\
					"basketkeyalias" : "TRANSACTION_ID", \
					"basketkeyaliasvalue" : "67380", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2384"} \
					]\
				}\
			]\
		}');
		

		var actualresult = processor.runAggregator(addtransactionrecords, systemconfig);
		
		assert.deepEqual(actualresult,expectedoutput);
		
    })
    
    it('runAggregator: Including time based aggregators', function(){	
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
		
		var addtransactionrecords = [];		
		addtransactionrecords.push(record1);
		addtransactionrecords.push(record2);
		addtransactionrecords.push(record3);				

		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID",\
							"timebaseditems" : [\
								{\
									"periodtype" : "month",\
									"offset" : "6"\
								}\
							]\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
							} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
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
			]\
		}');	
		
		var expectedresultvalidation = [];
		var validateresult = processor.validateSystemConfig(systemconfig);
		
		assert.deepEqual(validateresult,expectedresultvalidation);		
				
		//this deals with time based accumulators by the nature of the tuples
		var expectedoutput = JSON.parse('{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "CUSTOMER_ID", \
					"basketkeyaliasvalue" : "59005", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"perioddate": "20150206T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"perioddate": "20150206T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
						{"perioddate": "20150206T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
					]\
				}\
			]\
		}');
		
		var actualresult = processor.runAggregator(addtransactionrecords, systemconfig);
		
		assert.deepEqual(actualresult,expectedoutput);			
	})
	
	it('addPeriodOffsetTuples: ', function() {
		var systemconfig = JSON.parse('{ \
			"mappings" : [\
				{\
					"object" : "sale",\
					"objectkey" : "customer_id",\
					"objectperiodrelevance" : "sale_date",\
					"basketname" : "SALES",\
					"basketaction" : "BUY", \
					"basketkeyalias" : "CUSTOMER_ID",\
					"objectfields" : [\
						{\
							"fieldname" : "product_id",\
							"basketfieldname" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "within", \
							"offset" : "6"\
						}\
					]\
				}\
			],\
			"tuples" : [\
				{\
					"name" : "TUPLEA",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						} \
					]\
				},\
				{\
					"name" : "TUPLEB",\
					"basketfields" : [\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID"\
						},\
						{\
							"filter" : "all", \
							"basketfieldalias" : "PRODUCT_ID",\
							"periodtype" : "month",\
							"offsettype" : "within", \
							"offset" : "6"\
						}\
					]\
				}\
			]\
		}');
		
		var expectedresultvalidation = [];
		var validateresult = processor.validateSystemConfig(systemconfig);
		
		assert.deepEqual(validateresult,expectedresultvalidation);					
		
		var input = JSON.parse('{\
			"aggregators" : [\
				{\
					"object" : "sale", \
					"basketkeyalias" : "CUSTOMER_ID", \
					"basketkeyaliasvalue" : "59005", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"perioddate": "20150106T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"perioddate": "20150606T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"perioddate": "20150706T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},  \
						{"perioddate": "20150606T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					]\
				}\
			]\
		}');	
		
		var expectedoutput = JSON.parse('{\
			"aggregators" : [\
				{\
					"object" : "sale", \
					"basketkeyalias" : "CUSTOMER_ID", \
					"basketkeyaliasvalue" : "59005", \
					"periodrelevance" : "2015/02", \
					"data" : [\
						{"perioddate": "20150106T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"perioddate": "20150606T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
						{"perioddate": "20150606T115527Z","periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381", "weight" : "0"}, \
						{"perioddate": "20150706T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},  \
						{"perioddate": "20150706T115527Z","periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381", "weight" : "0"},  \
						{"perioddate": "20150606T115527Z","periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					]\
				}\
			]\
		}');	
		
		var output = processor.addPeriodOffsetTuples(input,systemconfig);
			
		assert.deepEqual(output,expectedoutput);		
	})	  
  })  
  

  
  /*
  describe('Test Counters', function(){
    it('Test Counter', function(){	
		var inputrecord = '{\
			"aggregators" : [\
				{\
					"basketkeyalias" : "TRANSACTION", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "YYYY/MM", \
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
					"periodrelevance" : "YYYY/MM", \
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
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}		\
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}					\
					],\
					"count" : "1"\
				},			\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}					\
					],\
					"count" : "1"\
				},									\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},\
						{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},\
				{\
					"periodrelevance" : "YYYY/MM", \
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
					"periodrelevance" : "YYYY/MM", \
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
					"periodrelevance" : "YYYY/MM", \
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
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"} \
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},			\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},									\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},\
				{\
					"periodrelevance" : "YYYY/MM", \
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
  describe('Test Confidence Calculators', function(){
    it('Test Confidence Calculator', function(){	
		var inputvalue = '{\
			"tuples": [\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"} \
					],\
					"count" : "1"\
				},	\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},			\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},									\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"} \
					],\
					"count" : "1"\
				},\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				},\
				{\
					"periodrelevance" : "YYYY/MM", \
					"tuple" : [\
						{"periodtype": "month", "periodoffset" : "0", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"},		\
						{"periodtype": "month", "periodoffset" : "6", "basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"} \
					],\
					"count" : "1"\
				}\
			]\
	    }';	
	})
  })	
  */	
})
