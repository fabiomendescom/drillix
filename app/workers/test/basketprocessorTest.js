var assert = require('chai').assert;


describe('Basket Processor Test', function(){
  describe('Test Input from Transaction', function(){
    before(function() {
		var inputtransaction1 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1808"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction2 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1809"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction3 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1810"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 
		var inputtransaction4 = JSON.parse('{"_id": {"$oid": "5521dc70163a4401005bdee5"},"Process": {"Type": "AddEvent","Data": {"account": "darby","object": "sale","fields": [{"name": "partner_id","value": "65"},{"name": "net_amount","value": 14},{"name": "gross_amount","value": 19},{"name": "unique_sale_id","value": "T100"},{"name": "product_id","value": "1810"},{"name": "variant_id","value": "1998"},{"name": "line_number","value": "54676"},{"name": "quantity","value": 1},{"name": "sale_date","value": "20140715T064347Z"},{"name": "customer_id","value": "120845"}]}}}'); 

		//this structure allows the system to know how to accumulate the fields into a "transaction" that will be used for
		//the basket analysis
		var = basketaccumulators1 = "{ \
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
		}";
		
		var = basketaccumulatorsoutput1 = "{ \
			'acumulatoroutput' : { \
				'object' : 'sale', \
				'basketkey' : 'unique_sale_id', \
				'basketkeyvalue' : 'T100', \
				'associations': [ \
					{ \
						'field' : 'product_id', \
						'value' : '1808', \
						'count' : '1' \
					}, \
					{ \
						'field' : 'product_id', \
						'value' : '1809' \
						'count' : '1' \
					}, \
					{ \
						'field' : 'product_id', \
						'value' : '1810', \
						'count' : '2' \
					} \
				] \
			} \
		}";

		var expectedoutput1 = '{"id":"T100","data":["((sale))1808"]}';
    })	  
    it('should count individual transactions', function(done){	
		
    })
  })
})
