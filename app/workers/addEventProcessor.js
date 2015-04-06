module.exports = {
  process: function (payload, db, processors, callback) {
		//console.log('Starting Event Processor');
		//console.log("Process payload: " + JSON.stringify(payload));
		objecttoinsert = payload;  
		//saving to mongodb
		//console.log("Saving to mongodb");
		var mongocollection = "darby-sale";  		
		collection = db.collection(mongocollection);
		collection.insert(objecttoinsert, {w:1}, function(err,result){
			//console.log("Saving complete");		
			var returnresult = {};
			if(err == null) {
				returnresult.status = "OK";
				returnresult.result = result;
			} else {
				returnresult.status = "ERROR";
				returnresult.error = err;
				context.done(err, "Errors in saving to mongodb"); 
			}	
			callback(returnresult);
		});			
  }
};
