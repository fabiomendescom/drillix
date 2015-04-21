
module.exports = {
	
	// TBD This function will receive a template data and a user config variables and will
	// return a modified UserConfig with all variables replaced and ready to be processed
	/* 
	* returns: userconfig
	*/
	/*
	convertTemplateToUserConfig: function(templateconfig, userconfigvariables) {
		//TBD
	},
	*/

	// TBD This function converts the user config array format that is more friendly to configure
	//to a system one more helpful for the processing
	/*
	* returns: systemconfig
	*/
	/*
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
*/

	/*
	 * 
	*/
	/*
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
	*/

	/*
	 * Validates that the system is valid
	*/
	validateSystemConfig: function(systemconfig) {
		var errors = [];

		for (var property in systemconfig) {
			if (property!="tuples" && property!="mappings") {
				errors.push("Property " + property + " is invalid");
			}
		}
		
		if(systemconfig.hasOwnProperty("mappings") == false) {
			errors.push("Config does not have a 'mappings' property");
		} else {
			if(systemconfig.mappings.hasOwnProperty("length")==false) {
				errors.push("'mappings' property must be an array");											
			} else {
				for (var x=0;x < systemconfig.mappings.length;x++) {
					for (var property in systemconfig.mappings[x]) {
						if (property!="object" && property!="objectkey" && property!="objectperiodrelevance" && property!="basketname" && property!="basketaction" && property!="basketkeyalias" && property!="objectfields") {
							errors.push("Property " + property + " is invalid");
						}
					}
				}					
				if(systemconfig.mappings.length == 0) {
					errors.push("'mappings' array must not be empty");
				} else {
					for (var x = 0; x < systemconfig.mappings.length; x++) {
						if(systemconfig.mappings[x].hasOwnProperty("object")==false) {
							errors.push("'object' property does not exist in 'mappings' at index " + x);
						};
						if(systemconfig.mappings[x].hasOwnProperty("objectkey")==false) {
							errors.push("'objectkey' property does not exist in 'mappings' at index " + x);
						};			
						if(systemconfig.mappings[x].hasOwnProperty("objectperiodrelevance")==false) {
							errors.push("'objectperiodrelevance' property does not exist in 'mappings' at index " + x);
						};		
						if(systemconfig.mappings[x].hasOwnProperty("basketname")==false) {
							errors.push("'basketname' property does not exist in 'mappings' at index " + x);
						};
						if(systemconfig.mappings[x].hasOwnProperty("basketaction")==false) {
							errors.push("'basketaction' property does not exist in 'mappings' at index " + x);
						};			
						if(systemconfig.mappings[x].hasOwnProperty("basketkeyalias")==false) {
							errors.push("'basketkeyalias' property does not exist in 'mappings' at index " + x);
						};				
						if(systemconfig.mappings[x].hasOwnProperty("objectfields")==true) {					
							if(systemconfig.mappings[x].objectfields.hasOwnProperty("length")==false) {
								errors.push("'objectfields' must be an array in 'mappings' at index " + x);
							} else {								
								for (var xx=0;xx < systemconfig.mappings[x].objectfields.length;xx++) {
									for (var property in systemconfig.mappings[x].objectfields[xx]) {
										if (property!="fieldname" && property!="basketfieldalias" && property!="periodtype" && property!="offsettype" && property!="offset") {
											errors.push("Property " + property + " is invalid");
										}
									}
								}																
								if(systemconfig.mappings[x].objectfields.length == 0) {
									errors.push("'objectfields' must not be empty in 'mappings' at index " + x);
								} else {
									for (var y = 0; y < systemconfig.mappings[x].objectfields.length; y++) {
										if(systemconfig.mappings[x].objectfields[y].hasOwnProperty("fieldname")==false) {
											errors.push("'fieldname' does not exist at index " + y + " in 'mappings' at index " + x);
										};
										if(systemconfig.mappings[x].objectfields[y].hasOwnProperty("basketfieldalias")==false) {
											errors.push("'basketfieldalias' does not exist at index " + y + " in 'mappings' at index " + x);
										};		
									}
								}
							}
						} else {
							errors.push("'objectfields' property does not exist in 'mappings' at index " + x);
						};																																
					}
				}
			};			
		};
		if(systemconfig.hasOwnProperty("tuples") == false) {
			errors.push("Config does not have a 'tuples' property");
		} else {
			if(systemconfig.tuples.hasOwnProperty("length")==false) {
				errors.push("'tuples' property must be an array");
			} else {
				for (var x=0;x < systemconfig.tuples.length;x++) {
					for (var property in systemconfig.tuples[x]) {
						if (property!="name" && property!="basketfields") {
							errors.push("Property " + property + " is invalid");
						}
					}
				}						
				if(systemconfig.tuples.length == 0) {
					errors.push("'tuples' array must not be empty");
				} else {				
					for (var x = 0; x < systemconfig.tuples.length; x++) {
						if(systemconfig.tuples[x].hasOwnProperty("name") == false) {
							errors.push("'name' property missing from tuple at index " + x);
						};
						if(systemconfig.tuples[x].hasOwnProperty("basketfields") == false) {
							errors.push("'basketfields' property missing from tuple at index " + x);
						} else {
							if(systemconfig.tuples[x].basketfields.hasOwnProperty("length")==false) {
								errors.push("'basketfields' property must be an array from tuple at index " + x);
							} else {								
								for (var xx=0;xx < systemconfig.tuples[x].basketfields.length;xx++) {
									for (var property in systemconfig.tuples[x].basketfields[xx]) {
										if (property!="filter" && property!="basketfieldalias" && property!="periodtype" && property!="offsettype" && property!="offset") {
											errors.push("Property " + property + " is invalid");
										}
									}
								}																	
								if(systemconfig.tuples[x].basketfields == 0) {
									errors.push("'basketfields' array must not be empty from tuple at index " + x);
								} else {
									for(var xx = 0; xx < systemconfig.tuples[x].basketfields.length; xx++) {
										if(systemconfig.tuples[x].basketfields[xx].hasOwnProperty("offsettype")) {
											var offsettype = systemconfig.tuples[x].basketfields[xx].offsettype;
											if(offsettype != "within" && offsettype != "after" && offsettype != "exact") {
												errors.push("Invalid offset type at index " + x);
											}
										}	
										if(systemconfig.tuples[x].basketfields[xx].hasOwnProperty("periodtype")) {
											var periodtype = systemconfig.tuples[x].basketfields[xx].periodtype;
											if(periodtype != "month") {
												errors.push("Invalid period type at index " + x);
											}
										}	
										if(systemconfig.tuples[x].basketfields[xx].hasOwnProperty("offsettype")) {
											var offset = systemconfig.tuples[x].basketfields[xx].offset;
											if(isNaN(parseFloat(offset))) {
												errors.push("Invalid offset type at index " + x);
											} else {
												if(parseFloat(offset) < 0) {
													errors.push("Offset must be greater than 0 at index " + x);
												}
											}
										}																					
									}
								}
							}
						};
					}
				}				
			};		
		};
			
		//TODO: THIS NEEDS TO BE FINISHED. ADD VALIDATION THNAT THE ALIASES USED IN TUPLES HAVE BEEN DEFINED IN MAPPINGS
		
		
		return errors;		
	},

	/*
	 * 
	*/
	getMapping: function(obj, systemconfig) {
			for (var j = 0; j < systemconfig.mappings.length; j++) {
				if (systemconfig.mappings[j].object == obj) {
					return systemconfig.mappings[j];
				}
			}
			return null;
	},	
	
	/*
	 * 
	*/
	getObjectField: function(objectname, fieldname, systemconfig) {
		for (var x = 0; x < systemconfig.mappings.length; x++) {
			if (systemconfig.mappings[x].object == objectname) {
				for (var j = 0; j < systemconfig.mappings[x].objectfields.length; j++) {
					if(systemconfig.mappings[x].objectfields[j].basketfieldalias == fieldname) {
						return systemconfig.mappings[x].objectfields[j];
					}
				}
			}
		}
		return null;
	},		

	/*
	 * if it finds the datatoget in aggregator then returns it, otherwise return a new object
	*/
	getDataForTransactionId: function(datatoget,datavalue, dataperiod, aggregator) {
			for (var i = 0; i < aggregator.length; i++) {
				if (aggregator[i].basketkeyaliasvalue == datavalue) {
					return aggregator[i];
				}
			}
			item = new Object();
			item.basketkeyalias = datatoget;
			item.basketkeyaliasvalue = datavalue;
			item.periodrelevance = dataperiod;
			item.data = [];		
			return item;	
	},
	
	/*
	 * 
	*/
	addToAggregator: function(item,aggregators) {
			var found = false;
			for (var i = 0; i < aggregators.length; i++) {
				if (aggregators[i].basketkeyaliasvalue == item.basketkeyaliasvalue) {
					found = true;
				}
			}			
			if (found==false) {
				aggregators.push(item);
			}
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
		var aggregators = [];
		var items = {};
		// Loop through the array of records
		for (var i = 0; i < addtransactionrecords.length; i++) {
			var objectname = addtransactionrecords[i].object;
			// gets the mapping for object in the transaction
			var mapping = this.getMapping(objectname, systemconfig);	
			// if mapping is found
			if (mapping != null) {
				var relevanceperiodfield = addtransactionrecords[i].fields[mapping.objectperiodrelevance];
				var relevanceperiod = relevanceperiodfield.substr(0,4) + "/" + relevanceperiodfield.substr(4,2);
				item = this.getDataForTransactionId(mapping.basketkeyalias,addtransactionrecords[i].fields[mapping.objectkey], relevanceperiod, aggregators);				
				for (var x = 0; x < mapping.objectfields.length; x++) {					
					var field = mapping.objectfields[x];
					var fielditem = {};
					fielditem.basketfieldalias = field.basketfieldalias;
					fielditem.basketfieldaliasvalue = addtransactionrecords[i].fields[field.fieldname];
					if(field.hasOwnProperty("periodtype")) {
						fielditem.perioddate = addtransactionrecords[i].fields[mapping.objectperiodrelevance]
						fielditem.periodtype = field.periodtype;
						fielditem.periodoffset = "0";	
					}
					item.data.push(fielditem);
				}
				this.addToAggregator(item,aggregators);
			}
		}
		items.aggregators = aggregators;
		
		return items;			
	},
	
	/*
	 * This function will look at the aggregator generated by the runAggregator function and
	 * if the tuples are time based (contain periodtype and periodoffset), then check if the
	 * elements inside the tuples are within period offset of other tuples. If so, then it 
	 * writes a new element to the tuple to reflect this
	*/
	addPeriodOffsetTuples: function(aggregator, systemconfig) {
		var thingstoadd = [];
		for (var i = 0; i < aggregator.aggregators.length; i++) {
			var mapping = this.getMapping(aggregator.aggregators[i].object, systemconfig);			
			for (var j = 0; j < aggregator.aggregators[i].data.length; j++) {
				for (var x = j; x < aggregator.aggregators[i].data.length; x++) {
					if(x!=j) {
						//make sure they are on the same periodtype
						if(aggregator.aggregators[i].data[j].periodtype == aggregator.aggregators[i].data[x].periodtype) {
							var objectfield = this.getObjectField(aggregator.aggregators[i].object,aggregator.aggregators[i].data[j].basketfieldalias,systemconfig);

								//check if timebase is the same as the aggregation being looked at
								if(objectfield.periodtype == aggregator.aggregators[i].data[j].periodtype) {
									//check if applying the offset matches
									var offset = objectfield.offset;
									var offsettype = objectfield.offsettype;
									var tuple1 = aggregator.aggregators[i].data[j];
									var tuple2 = aggregator.aggregators[i].data[x];
									//order is in ascending order
									var firsttuple;
									var secondtuple;
									if (tuple1.perioddate > tuple2.perioddate) {
										firsttuple = tuple2;
										secondtuple = tuple1;
									} else {
										firsttuple = tuple1;
										secondtuple = tuple2;
									}
									//Check if this tuple fits the offset
									firsttupledate = new Date(firsttuple.perioddate.substr(0,4)+"-"+firsttuple.perioddate.substr(4,2)+"-"+firsttuple.perioddate.substr(6,2)+" "+firsttuple.perioddate.substr(9,2)+":"+firsttuple.perioddate.substr(11,2));
									secondtupledate = new Date(secondtuple.perioddate.substr(0,4)+"-"+secondtuple.perioddate.substr(4,2)+"-"+secondtuple.perioddate.substr(6,2)+" "+secondtuple.perioddate.substr(9,2)+":"+secondtuple.perioddate.substr(11,2));
									firsttupledateplusoffset = new Date(firsttupledate.getTime());
									//now see which comparison you must do
									var periodtype = aggregator.aggregators[i].data[j].periodtype;
									if(periodtype == "month") {
										firsttupledateplusoffset.setMonth(firsttupledateplusoffset.getMonth()+offset);
										if(offsettype == "within") {
											if(firsttupledateplusoffset < secondtupledate) {
												//add this to tuple array. Add the secondtuple
												var toadd = JSON.parse(JSON.stringify(secondtuple));
												toadd.periodoffset = offset;
												thingstoadd.push(toadd);
											}
										} else if (offsettype == "after"){
											if(firsttupledateplusoffset > secondtupledate) {
												//add this to tuple array. Add the secondtuple
												var toadd = JSON.parse(JSON.stringify(secondtuple));
												toadd.periodoffset = offset;
												thingstoadd.push(toadd);
											}										
										}
									}	
								}						
						}
					}
				}
			}
			for (var xxx = 0; xxx < thingstoadd.length; xxx++) {
				aggregator.aggregators[i].data.push(thingstoadd[xxx]);
			}
			thingstoadd = [];
		}
				
		return aggregator;
	},
	
	/*
	 * This will receive a function as a parameter. This function will contain logic to talk
	 * to the persistent engine to retrieve any past transactions that will fit the 
	 * periodoffset (if the tuples are time based0. If it fits, it will bring
	 * the transanction data to the tuple and add the period offset along with a weight of zero.
	 * A weight of zero means that this is data coming from the persistent engine and cannot
	 * be used to count anything since it has already been counted.
	*/
	addPersistentPeriodOffsetTuples: function(persistencefunction, systemconfig) {
		
	},


	/*
	* returns: counterrecords
	*/
	runCounter: function(aggregatorrecords) {
	
	}
};
