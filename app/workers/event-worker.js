// WORKER DESCRIPTION:
// This worker will look at the event queue and process messages from there. 
// STEP 1: Enrich the data    
// STEP 2: Save the event    
// STEP 3: Redirect to analysis queues 
// STEP 3a : Redirect to association analysis queue

//META DATA
/*
{
	"objectname" : "customer",
	"objecttype" : "entity",  
	"objectsourceid" : "customer_id",  
	"objectfields" : [
	   {	  
		   "name" : "customer_name",
		   "type" : "string",
		   "validation" : [
				{
					"mandatory" : "true",
					"characters" : {
						"min" : "10",
						"max" : "100"
					}
				}
		   ] 		   		   
	   },
	   {	  
		   "name" : "customer_name",
		   "type" : "string"		   
	   },
	   {	  
		   "name" : "tags",
		   "type" : "string-list"		   
	   },	   
	   {
		   "name" : "sales",
		   "type" : "transactionobject",
		   "objectreference": {
			   "object" : "sale",
			   "key" : "customer_id"
		   }
	   }
	]
}

{
	"objectname" : "sale",
	"objecttype" : "transaction",    
	"objectsourceid" : "unique_sales_id",
	"objectfields" : [
	   {	  
		   "name" : "line_number",
		   "type" : "int",		
		   "validation" : [
				{
					"mandatory" : "true",
					"range" : {
						"from" : "0",
						"to" : "100"
					}
				}
		   ]   
	   },
	   {	   
		   "name" : "product_id",
		   "type" : "entityobject",
		   "objectreference": {
			   "object" : "product",
			   "key" : "id"
		   }		   
	   },
	   {
		   "name" : "variant_id",
		   "type" : "entityobject",
		   "objectreference" : {
			   "object" : "variant", 
			   "key" : "id"
		   }		   
	   },
	   {
		   "name" : "customer_id",
		   "type" : "entityobject",
		   "objectreference" : {
			   "object" : "customer", 
			   "key" : "id"
		   }		   
	   },
	   {   
		   "name" : "sale_date",
		   "type" : "datetime"
	   },  
	   {
		   "name" : "gross_amount",
		   "type" : "money"		   
	   },
	   {   
		   "name" : "net_amount",
		   "type" : "money"	   
	   },
	   {  
		   "name" : "quantity",
		   "type" : "double"		   
	   },   
	   {
		   "name" : "partner_id",
		   "type" : "entityobject",
		   "objectreference" : {
			   "object" : "partner", 
			   "key" : "id"
		   }		   
	   }
	]
}
*/

// Some configs
var tenant				= "darby";
var accesskey 			= "AKIAIUAUOG5OVKIGNYWQ";
var secretkey 			= "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";
var region 				= "us-east-1";
var mongouri			= "mongodb://heroku_app34960699:pbho09fpelbpp597c21fu0cami@ds029197.mongolab.com:29197/heroku_app34960699";                                        

var SqsQueueParallel = require('sqs-queue-parallel');
var sqs = require('sqs');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Simple configuration:
//  - 2 concurrency listeners
//  - each listener can receive up to 4 messages
// With this configuration you could receive and parse 8 `message` events in parallel
var queue = new SqsQueueParallel({
    name: tenant + "-events",
    maxNumberOfMessages: 4,
    concurrency: 2,
    region: region,
    accessKeyId: accesskey,
    secretAccessKey: secretkey
});
var associationqueue = sqs({
    access: accesskey,
    secret: secretkey,
    region: region 
});

var enrichDate = function(element, fieldname) {
	element[0]["_" + fieldname + "_ymd"] = (element[0][fieldname]).substring(0,8);
	element[0]["_" + fieldname + "_ym"] = (element[0][fieldname]).substring(0,6);
	element[0]["_" + fieldname + "_y"] = (element[0][fieldname]).substring(0,4);
	element[0]["_" + fieldname + "_m"] = (element[0][fieldname]).substring(4,6);
	element[0]["_" + fieldname + "_d"] = (element[0][fieldname]).substring(6,8);
	element[0]["_" + fieldname + "_weekday"] = new Date(element[0]["_" + fieldname + "_y"] + "-" + element[0]["_" + fieldname + "_m"] + "-" + element[0]["_" + fieldname + "_d"]).getDay();
	if (element[0]["_" + fieldname + "_weekday"] == 0 || element[0]["_" + fieldname + "_weekday"] == 6) {
		isweekend = 1;
	} else {
		isweekend = 0;
	};
	element[0]["_" + fieldname + "_isweekend"] = isweekend;	
	return element;
}

// Use connect method to connect to the Server
MongoClient.connect(mongouri, function(err, db) {
		//assert.equal(null, err);
		console.log("Connected correctly to mongodb server");

		// Get event messages to process
		queue.on('message', function (e)
		{
			console.log('New message: ', e.metadata, e.data.MessageId)
    
			///////////////////////
			// PROCESS THE EVENT //
			///////////////////////
    
			/////////////////////////////
			// STEP 1: Enrich the data //
			/////////////////////////////
    
			// TODO: in the future, have a json representation of the event (metadata) that identifies what every field is, types, et
			// this will allow the enricher to do a better job, generically, on enriching the data. Things such as identifying when
			// a field is a city, what is the state associated with the city, etc can be helpful to enrich the data even better. For now
			// we will hard code
       
			// enrich sale_date   	
			enrichDate(e.data.sale, "sale_date"); 
				
			// TODO: you should accept the timezone of the sale or whatever date as well and put this in a new field coming in
			// TODO: the metadata eventually has to know the country of the sale. This way it can also enrich with "isholiday" and even
			//      holiday names for further enrichment
    
			////////////////////////////
			// STEP 2: Save the event //
			////////////////////////////
			darbysalecollection = db.collection('darby-sale');
			darbysalecollection.insert([
				e.data.sale[0]
			], function(err, result) {
		
			});
    
			/////////////////////////////////////////
			// STEP 3: Redirect to analysis queues //
			/////////////////////////////////////////
    
			//////////////////////////////////////////////////////
			// STEP 3a : Redirect to association analysis queue //
			//////////////////////////////////////////////////////
    
				// TODO: In the future, you need to check if the user has configured association and if it is really necessary
				// to send it to that queue. That is, only send to queues that are for functionalities that have been configured
    
			// push to the association queue for further processing
			associationqueue.push(tenant + '-analysis-association', e.data);
    
			///////////////////////////////////////////////
			// STEP 4: Delete the message from the queue //
			///////////////////////////////////////////////
     
			e.deleteMessage(function(err, data) {
				e.next();
			});
		});

		queue.on('error', function (err)
		{
			console.log('There was an error: ', err);
		});
});
