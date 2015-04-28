var jsonPath = require('JSONPath');

module.exports = {
	
	enrich: function(payload, enrichconfig) {
		
	},

	/*
	 * DESCRIPTION:
	 * This function takes an array of an array and flattens it into a single one dimensional array
	 * INPUT:
	 * - array to flatten (double array)
	 * OUTPUT:
	 * - single array flattened
	*/
	flattenArray: function(arraytoflatten) {
		var result = [];
		for(x = 0; x < arraytoflatten.length; x++) {
			for(y = 0; y < arraytoflatten[x].length; y++) {
				result.push(arraytoflatten[x][y]);
			}
		}
		return result;
	},
	
	/*
	 * DESCRIPTION: 
	 * Takes any payload and an array of templates. By using the array of templates, the function will transform
	 * the payload to the various bucket templates
	 * INPUT: 
	 * - Any json payload
	 * RETURN;
	 * - Array of buckets created by the templates
	*/	
	createBuckets: function(payload, buckettemplatearray) {
		var buckettemplatearraystring = JSON.stringify(buckettemplatearray);

		var result = buckettemplatearraystring;
		var re = /"<<(.*?)>>"/g
		while( res = re.exec(result) ) {
			var temp = '"' + jsonPath.eval(payload, res[1]) + '"';
			result2 =  result2.replace(res[0], temp);
		}
			
		console.log("createBuckets ==> " + result2);	
		return JSON.parse(result2);
	},

	/*
	 * DESCRIPTION: 
	 * Based on a size, creates all combinations of the tuples based on tuple size
	 * INPUT: 
	 * - array of buckets and the size of the tuples to be used in the combination
	 * RETURN;
	 * - array of tuples of typlesize
	*/		
	createSubsetsOfSize: function(bucketarray, tuplesize) {
			var set = bucketarray; 
			var setLength = set.length;
			var result = [];
			
			// define the subset length and initialize the first subset
			var subsetLength = tuplesize;
			var aSubset = new Array(subsetLength+1);

			var i;
			for( i = 0 ; i < subsetLength ; i++ ) aSubset[i]=i;

			// place a guard at the end
			aSubset[subsetLength] = setLength;

			// generate each of the posible subsets 
			// This is just a sum with carry where the value of each of the "digits" 
			// is in the range [i..subset[i+1])
			var r = 0, start = 0;
			do {
				var tuple = {};
				tuple.tuple = [];				
				// print the subset
				for( i = 0 ; i < subsetLength ; i++ ) {
					tuple.tuple.push(set[aSubset[i]]);
				};
				result.push(JSON.parse(JSON.stringify(tuple)));

				// calculate the next subset
				for( i = start, r = 1 ; i < subsetLength ; i++ ) {
					aSubset[i]++;
					if (aSubset[i] < aSubset[i+1]) { 
						start = ( i==0 ? 0 : i-1 ); 
						r = 0; 
						break; 
					} else { 
						aSubset[i] = i 
					};
				};
			} while (r == 0);		
			return result;
	},

	/*
	 * DESCRIPTION: 
	 * This analyses the associationconfigarray and returns the highest tuple size found
	 * INPUT: 
	 * - array of configurations
	 * RETURN;
	 * - highest tuple size
	*/		
	getHighestTupleSize: function(associationconfigarray) {
		var highest = 0;
		for(x = 0; x < associationconfigarray.length; x++) {
			if(associationconfigarray[x].tuplesize > highest) {
				highest = associationconfigarray[x].tuplesize;
			}
		}
		return highest;
	},

	/*
	 * DESCRIPTION: 
	 * This function will take an array of buckets and will create a combination of tuples based on the array of
	 * configurations given to it.
	 * INPUT: 
	 * - array of buckets and
	 * RETURN;
	 * - 
	*/		
	createBucketTuples: function(bucketarray,associationconfigarray) {
		
			var results = [];
		   	var set = bucketarray;
		   	var maxsize = this.getHighestTupleSize(associationconfigarray);
		   	for(i = 2; i <= maxsize; i++) {
				results.push(this.createSubsetsOfSize(set, i));
			}						
			
			var finalresult = this.flattenArray(results);
			
			return finalresult;
	},
	
	/*
	 * DESCRIPTION: 
	 * Takes an array of tuples and a configuration array as inputs and applies
	 * the configuration in a way to match first the tuple count. If the tuple count (how many buckets are in the tuple) matches
	 * the tuple array index item, then it will match the keys. If they match, it will apply the "then" directive from
	 * the configuration in order to create an associated tuple, that is, one that associated the right tuples together.
	 * INPUT: 
	 * - buckettuplesarray - an array of tuples that will be associated
	 * - associationconfigarray - an array of configuration items showing the matches necessary to associate
	 * RETURN;
	 * - An array of associated tuples
	*/
	createAssociatedBucketTuples: function(buckettuplesarray, associationconfigarray) {
		var associatedtuples = {};
		associatedtuples.associatedtuples = [];
		//loop through the configurations		
		for(xx = 0; xx < associationconfigarray.length; xx++) {
			var associationconditions = associationconfigarray[xx].associationconditions;
			var associationconditionsstring = JSON.stringify(associationconditions);
			var result = associationconditionsstring;
			
			//loop through the array of tuples
			for(yy = 0; yy < buckettuplesarray.tuples.length; yy++) {
				//first check if the tuple size matches the current config tuple size, otherwise it is an automatic mismatch
				if(buckettuplesarray.tuples[yy].tuple.size == associationconfigarray[xx].tuplesize) {			
					var result2 = result;
					var re = /"<<(.*?)>>"/g
					while( res = re.exec(result) ) {
						var temp = '"' + jsonPath.eval(buckettuplesarray.tuples[yy].tuple, res[1]) + '"';
						result2 =  result2.replace(res[0], temp);
					}
					//now see if the match on the association condition works
					var matched = true;
					var resultobject = JSON.parse(result2);
					for(x = 0; x < resultobject.length; x++) {
						if(resultobject[x].match != resultobject[x]["with"]) {
							matched = false;
						}
					};
					if(matched) {
						var item = associationconfigarray[xx].then;
						var bucket = JSON.stringify(item);
						var xresult = bucket;
						var xresult2 = xresult;
						var xre = /"<<(.*?)>>"/g
						while( xres = xre.exec(xresult) ) {
							var xtemp = '"' + jsonPath.eval(buckettuplesarray.tuples[yy].tuple, xres[1]) + '"';
							xresult2 =  xresult2.replace(xres[0], xtemp);
						}
						//put this in the associated tuple. Match
						associatedtuples.associatedtuples.push(JSON.parse(xresult2));
					}
				}						
			}							
		}		
		console.log("createAssociatedBucketTuples ==> " + JSON.stringify(associatedtuples));	
		
		return associatedtuples;
	},
	
	aggregateBuckets: function(bucket1, bucket2) {
	
	},
	
	
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
						if (property!="object" && property!="objectkey" && property!="objecttransactiondate" && property!="objectperiodrelevance" && property!="basketname" && property!="basketaction" && property!="basketkeyalias" && property!="objectfields") {
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
						if(systemconfig.mappings[x].hasOwnProperty("objecttransactiondate")==false) {
							errors.push("'objecttransactiondate' property does not exist in 'mappings' at index " + x);
						};							
						if(systemconfig.mappings[x].hasOwnProperty("basketname")==false) {
							errors.push("'basketname' property does not exist in 'mappings' at index " + x);
						};
						if(systemconfig.mappings[x].hasOwnProperty("basketaction")==false) {
							errors.push("'basketaction' property does not exist in 'mappings' at index " + x);
						};			
						//if(systemconfig.mappings[x].hasOwnProperty("basketkeyalias")==false) {
						//	errors.push("'basketkeyalias' property does not exist in 'mappings' at index " + x);
						//};				
						if(systemconfig.mappings[x].hasOwnProperty("objectfields")==true) {					
							if(systemconfig.mappings[x].objectfields.hasOwnProperty("length")==false) {
								errors.push("'objectfields' must be an array in 'mappings' at index " + x);
							} else {								
								for (var xx=0;xx < systemconfig.mappings[x].objectfields.length;xx++) {
									for (var property in systemconfig.mappings[x].objectfields[xx]) {
										if (property!="fieldname" && property!="fieldinstanceid" && property!="fieldname" && property!="periodtype" && property!="offsettype" && property!="offset") {
											errors.push("Property " + property + " is invalid");
										}
									}							
									if(systemconfig.mappings[x].objectfields[xx].hasOwnProperty("offsettype")) {
										var offsettype = systemconfig.mappings[x].objectfields[xx].offsettype;
										if(offsettype != "within" && offsettype != "after" && offsettype != "exact") {
											errors.push("Invalid offset type at index " + x);
										}
									}	
									if(systemconfig.mappings[x].objectfields[xx].hasOwnProperty("periodtype")) {
										var periodtype = systemconfig.mappings[x].objectfields[xx].periodtype;
										if(periodtype != "month") {
											errors.push("Invalid period type at index " + x);
										}
									}	
									if(systemconfig.mappings[x].objectfields[xx].hasOwnProperty("offsettype")) {
										var offset = systemconfig.mappings[x].objectfields[xx].offset;
										if(isNaN(parseFloat(offset))) {
											errors.push("Invalid offset type at index " + x);
										} else {
											if(parseFloat(offset) < 0) {
												errors.push("Offset must be greater than 0 at index " + x);
											}
										}
									}																
								}																								
								if(systemconfig.mappings[x].objectfields.length == 0) {
									errors.push("'objectfields' must not be empty in 'mappings' at index " + x);
								} else {
									for (var y = 0; y < systemconfig.mappings[x].objectfields.length; y++) {
										if(systemconfig.mappings[x].objectfields[y].hasOwnProperty("fieldinstanceid")==false) {
											errors.push("fieldinstanceid' does not exist at index " + y + " in 'mappings' at index " + x);
										};										
										if(systemconfig.mappings[x].objectfields[y].hasOwnProperty("fieldname")==false) {
											errors.push("'fieldname' does not exist at index " + y + " in 'mappings' at index " + x);
										};
										//if(systemconfig.mappings[x].objectfields[y].hasOwnProperty("fieldname")==false) {
										//	errors.push("'fieldname' does not exist at index " + y + " in 'mappings' at index " + x);
										//};		
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
						if (property!="name" && property!="fields") {
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
						if(systemconfig.tuples[x].hasOwnProperty("fields") == false) {
							errors.push("'fields' property missing from tuple at index " + x);
						} else {
							if(systemconfig.tuples[x].fields.hasOwnProperty("length")==false) {
								errors.push("'fields' property must be an array from tuple at index " + x);
							} else {								
								for (var xx=0;xx < systemconfig.tuples[x].fields.length;xx++) {
									for (var property in systemconfig.tuples[x].fields[xx]) {
										if (property!="filter" && property!="fieldinstanceid") {
											errors.push("Property " + property + " is invalid");
										}
									}
									if(systemconfig.tuples[x].fields[xx].hasOwnProperty("fieldinstanceid")==false) {
										errors.push("'fieldinstanceid' missing from fields at index " + x);
									}
								}																	
								if(systemconfig.tuples[x].fields.length == 0) {
									errors.push("'fields' array must not be empty from tuple at index " + x);
								} else {
									
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
					if(systemconfig.mappings[x].objectfields[j].fieldname == fieldname) {
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
				//var relevanceperiodfield = addtransactionrecords[i].fields[mapping.objectperiodrelevance];
				//var relevanceperiod = relevanceperiodfield.substr(0,4) + "/" + relevanceperiodfield.substr(4,2);
				var relevanceperiod = addtransactionrecords[i].fields[mapping.objectperiodrelevance];
				var objecttransactiondate = addtransactionrecords[i].fields[mapping.objecttransactiondate];
				item = this.getDataForTransactionId(mapping.basketkeyalias,addtransactionrecords[i].fields[mapping.objectkey], relevanceperiod, aggregators);				
				for (var x = 0; x < mapping.objectfields.length; x++) {					
					var field = mapping.objectfields[x];
					var fielditem = {};
					fielditem.fieldname = field.fieldname;
					fielditem.fieldnamevalue = addtransactionrecords[i].fields[field.fieldname];
					if(field.hasOwnProperty("periodtype")) {
						fielditem.perioddate = addtransactionrecords[i].fields[mapping.objecttransactiondate]
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
							var objectfield = this.getObjectField(aggregator.aggregators[i].object,aggregator.aggregators[i].data[j].fieldname,systemconfig);

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
