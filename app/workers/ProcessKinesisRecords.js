/*
	This function is called by the Lambda service. It will take the event and see where to route it to so the 
	correct function can handle it
*/

//main processing unit
var mainprocess 		= require('./mainProcess');
  
exports.handler = function(event, context) {
	mainprocess.handle(event,context, function(result) {
		context.done(null, "Processed " + " Events Successfully"); 		
	});
};


