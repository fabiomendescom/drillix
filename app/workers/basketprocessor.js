
module.exports = {
	
	// TBD This function will receive a template data and a user config variables and will
	// return a modified UserConfig with all variables replaced and ready to be processed
	/* 
	* returns: userconfig
	*/
	convertTemplateToUserConfig: function(templateconfig, userconfigvariables) {
		//TBD
	},

	// TBD This function converts the user config array format that is more friendly to configure
	//to a system one more helpful for the processing
	/*
	* returns: systemconfig
	*/
	convertUserConfigToSystemConfig: function(userconfig) {
		var output = {};
		var result = {};
		
		output.configs = [];
		
		for (index = 0; index < userconfig.length; ++index) {
			var currentconfig = userconfig[index];
			var basketkey = currentconfig.forbasket.basketuniquefield;
			var obj = {};
			var accumulators = [];
			var accumulator = {};
			
			result.object = obj;
			result.basketkey = basketkey;
					
			//start with the "associate" piece
			accumulator.timebased = "0";
			//loop through items
			for (index2 = 0; index2 < currentconfig.forbasket.associate.items.length; ++index2) {
				var currentitem = currentconfig.forbasket.associate.items[index2];
				if (currentitem.hasOwnProperty("all")) {
					var fromitem = currentitem.all.from.split(".");
					var fromfield = fromitem[1];
					var fromobject = fromitem[0];
					
				}
			}
			
			accumulators.push(accumulator);
			result.accumulators = accumulators;
		}
		
		output.configs.push(result);
		return output;
		
		//TBD....................
	},


	extractAddTransactionsFromEventRecords: function(eventrecords, transactionsextractor, dataextractor) {
		var transactionextractor = function(eventrecords) {
			return transactionrecords.Records;
		};
		var dataextractor = function(individualrecord) {
			return individualrecord.kinesis.data.Process.AddEvent.Data;
		};
		
		var recordoutput = [];
		var records = transactionextractor(eventrecords);
		for (i = 0; i < records.length; i++) {
			var record = dataextractor(records[i]);
			recordoutput.push(record);
		}	
		return recordoutput;	
	},
	
	

	/* input:
	 * 
	 * transactionrecords : what comes from kinesis
	 * systemconfig : json representing all configurations for basket analysis
	 * transactionsextractor : function that will return only the array of transactions from the stream
	 * 
	 * returns: aggregatorrecords
	*/
	runAggregator: function(addtransactionrecords, systemconfig) {
		var getMapping = function(obj, systemconfig) {
			for (j = 0; j < systemconfig.mappings.length; j++) {
				if (systemconfig.mappings[j].object == obj) {
					return systemconfig.mappings[j];
				}
			}
			return null;
		}
		
		var aggregators = [];
		var item = {};		
		//find the position that matches with the current object
		for (i = 0; i < addtransactionrecords.length; i++) {
			var objectname = addtransactionrecords[i].object;
			var mapping = getMapping(objectname, systemconfig);
			if (mapping != null) {
				item.basketkeyalias = mapping.basketkeyalias;
				item.basketkeyaliasvalue = addtransactionrecords[i].fields[mapping.objectkey];
				item.periodrelevance = "YYYY/MM";
				item.data = [];
				for (x = 0; x < mapping.objectfields.length; x++) {					
					var field = mapping.objectfields[x];
					var fielditem = {};
					fielditem.basketfieldalias = field.basketfieldname;
					fielditem.basketfieldaliasvalue = addtransactionrecords[i].fields[field.fieldname];
					item.data.push(fielditem);
				}
				aggregators.push(item);
			}
		}
		console.log(aggregators);
		return aggregators;
		
		
			/*
				{\
					"basketkeyalias" : "TRANSACTION", \
					"basketkeyaliasvalue" : "67369", \
					"periodrelevance" : "YYYY/MM", \
					"data" : [\
						{\
							"values" : [	\
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2381"}, \
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2382"}, \
								{"basketfieldalias" : "PRODUCT_ID", "basketfieldaliasvalue" : "2383"}  \
							]	\
						}\
					]\
				},\		
			*/	
					
	},

	/*
	* returns: counterrecords
	* This function will receive the accumulatorrecords coming from runAggregator, but also will receive
	* persistedaggregatorrecords which will come from a data storage so counters can be added 
	* properly
	*/
	runCounter: function(aggregatorrecords) {
	
	}

};
