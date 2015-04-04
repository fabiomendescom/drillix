//expresso payloadRouterTester.js

//mongodb client
var MongoClient 		= require('mongodb').MongoClient, assert = require('assert');
//config and credentials
var drillixconfig		= require('drillixconfig');
//router
var payloadRouter       = require('payloadRouter');
//load processors
var addEventProcessor 	= require('addEventProcessor');

module.exports = {
    'test route to Event Processor': function(beforeExit, assert) {	    
	    
	    var payload = {};
	    payload.Process = {};
	    payload.Process.Type = "AddEvent";
	    payload.Process.Data = {};
	    var addevent = {};
	    addevent.account = "darby";
	    addevent.object = "sale";	    
	    var field = {};
	    field.name = "partner_id";
	    field.value = 1;
	    var fields = [];
	    fields.push(field); 
	       	    
	    payload.Process.Data = addevent;
	    
	    var processors = {};
	    processors.addEvent = module.exports = {
			process: function (payload, db, processors) {
				return null;
			}
		};	    
	    
	    var db = null;
        assert.equal("AddEvent", payloadRouter.route(payload,db,processors));
    }
};
