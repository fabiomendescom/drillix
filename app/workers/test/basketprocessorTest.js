var assert = require('chai').assert;


describe('Basket Processor Test', function(){
  describe('Test Input from Transaction', function(){
    before(function() {
		var inputtransaction1 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1808"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction2 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1809"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction3 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1810"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction4 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1810"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 


		//% of customers who bought product A and bought some product within 3 months TEMPLATE VARIABLES
		var template1 = "{\
			'meta': 'basket',\
			'name' : 'basketnew',\
			'template': {\
				'templatename' : 'baskettemplate2',\
				'variables': [\
					{\
						'($products$)' : [\
							'Prod A'\
						],\
						'($numberof$)' : '3',\
						'($periodscale$)' : 'months',\
						'($periodrange$)' : 'within',\
						'($support$)' : '0',\
						'($confidence$)' : '0',\
						'($lift$)' : '0',\
						'($effectivefrom$)' : 'xxx',\
						'($effectiveuntil$)' : 'xxx',\
						'($description$)' : {\
							'foward' : {\
								'en-US' : [\
									'($confidence$)% of customers who bought ($associate.items[0].value$) bought something else ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$). This scenario occurs ($support$)% of all transactions.'\
								],\
							},\
							'inverse' : {\
							}\
						},\
						'($uniquefield$)' : 'customer_id',\
						'($from$)' : 'sales.product_id',\
						'($periodfield$)' : 'sales.sales_date_ym',\
						'($condition$)' : 'exists'\
					}\
				]\
			}\
		}";


		//% of customers who bought 2 products together
		var userconfig1 = "{\
			'meta': 'basket',\
			'name': 'basket2',\
			'forbasket': {\
				'description': {\
					'forward': {\
						'en-US': [\
							'($confidence$)% of customers who bought ($associate.items[0].value$) also bought ($with.items[1].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)'\
						]\
					},\
					'inverse' : {\
					}\
				},\
				'effectivefrom': 'xxx',\
				'effectiveuntil': 'xxx',\
				'basketuniquefield': 'transaction_id',\
				'support': '000',\
				'confidence': '000',\
				'lift': '000',\
				'inverse' : 'true',\
				'associate': {\
					'items': [\
						{\
							'all': {\
								'from': 'sales.product_id'\
							},\
							'where': {\
								'record': 'exists'\
							}\
						}\
					]\
				},\
				'with': {\
					'items': [\
						{\
							'all': {\
								'from': 'sales.product_id'\
							},\
							'where': {\
								'record': 'exists'\
							}\
						}\
					]\
				}\
			}\
		}";

		//% of customers who bought a product and returned it within 6 months		
		var userconfig2 = "{\
			'meta': 'basket',\
			'name': 'basket2',\
			'forbasket': {\
				'description': {\
					'forward': {\
						'en-US': [\
							'($confidence$)% of customers who bought ($associate.items[0].value$) returned it ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)'\
						]\
					},\
					'inverse' : {\
					}\
				},\
				'effectivefrom': 'xxx',\
				'effectiveuntil': 'xxx',\
				'basketuniquefield': 'customer_id',\
				'support': '000',\
				'confidence': '000',\
				'lift': '000',\
				'inverse' : 'true',\
				'associate': {\
					'items': [\
						{\
							'all': {\
								'from': 'sales.product_id'\
							},\
							'where': {\
								'record': 'exists'\
							}\
						}\
					]\
				},\
				'with': {\
					'items': [\
						{\
							'same': {\
								'from': 'returns.product_id'\
							},\
							'where': {\
								'record': 'exists'\
							},\
							'timeframes': {\
								'from': 'sales.sales_date_ym',\
								'frames': [\
									{\
										'within': {\
											'6': 'months'\
										}\
									}\
								]\
							}\
						}\
					]\
				}\
			}\
		}";
		
		//Customers who bought prod x and prod y also buy prod z
		var userconfig3 = "{\
			'meta': 'basket',\
			'name': 'basket2',\
			'forbasket': {\
				'description': {\
					'forward' : {\
						'en-US': [\
							'($confidence$)% of customers who bought ($associate.items[0].value$) and ($associate.items[1].value$) also bought ($with.items[0].value$) ($with.items.frame.name$) ($with.items.frame.quantity$) ($with.items.frame.unit$)'\
						]\
					},\
					'inverse' : {\
					}\
				},\
				'effectivefrom': 'xxx',\
				'effectiveuntil': 'xxx',\
				'basketuniquefield': 'transaction_id',\
				'support': '000',\
				'confidence': '000',\
				'lift': '000',\
				'inverse' : 'true',\
				'associate': {\
					'items': [\
						{\
							'all': {\
								'from': 'sales.product_id'\
							},\
							'where': {\
								'record': 'exists'\
							}\
						},\
					{\
							'all': {\
								'from': 'sales.product_id'\
							},\
							'where': {\
								'record': 'exists'\
							}\
						}\
					]\
				},\
				'with': {\
					'items': [\
						{\
							'all': {\
								'from': 'sales.product_id'\
							},\
							'where': {\
								'record': 'exists'\
							}\
						}\
					]\
				}\
			}\
		}";

		//this structure allows the system to know how to accumulate the fields into a "transaction" that will be used for
		//the basket analysis
		var systemconfig1 = "{ \
			'configs' : [ \
				{ \
					'object' : 'sale', \
					'basketkey' : 'unique_sale_id', \
					'accumulators' : [ \
						{ \
							´timebased' : '0', \
							'fieldstotrack' : [ \
								'product_id' \
							] \
						}, \
						{ \
							´timebased' : '1', \
							'timetype' : 'month', \
							'timefield' : 'sale_date_ym', \
							'fieldstotrack' : [ \
								'product_id' \
							] \
						} \
					] \
				} \
			] \
		}";
		
		var basketaccumulatorsoutput1 = "{ \
			'accumulators' : [ \
				{ \
					'object' : 'sale', \
					'basketkey' : 'unique_sale_id', \
					'basketkeyvalue' : 'T100', \
					'fields': [ \
						{ \
							'field' : 'product_id', \
							'value' : '1808' \
						}, \
						{ \
							'field' : 'product_id', \
							'value' : '1809' \
						}, \
						{ \
							'field' : 'product_id', \
							'value' : '1810' \
						} \
					] \
				} \
			] \
		}";
		
		var basketcounteroutput1 = "{\
			'counters': [ \
				{ \
					'tuple' : [ \
						{ \
							'object' : 'sale', \
							'field' : 'product_id', \
							'value' : '1808' \
						}, \
						{ \
							'object' : 'sale', \
							'field' : 'product_id', \
							'value' : '1809' \
						} \
					], \
					'count' : '1' \
				} \
			] \
		}";


    })	  
    
    it('should count individual transactions', function(done){	
		
    })
  })
})
