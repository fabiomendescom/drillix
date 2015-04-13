
module.exports = {
	
	// This function will receive a template data and a user config variables and will
	// return a modified UserConfig with all variables replaced and ready to be processed
	/* 
	* returns: userconfig
	*/
	convertTemplateToUserConfig: function(templateconfig, userconfigvariables) {
		//TBD
	},

	//this function converts the user config array format that is more friendly to configure
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



	/* input:
	 * 
	 * transactionrecords : what comes from kinesis
	 * systemconfig : json representing all configurations for basket analysis
	 * transactionsextractor : function that will return only the array of transactions from the stream
	 * 
	 * returns: aggregatorrecords
	*/
	runAggregator: function(transactionrecords, systemconfig, transactionsextractor) {
	
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
