//./expresso ../../../app/workers/payloadRouterTester.js

var payloadRouter       = require('/home/mendes/Documents/drillix/angular-seed/app/workers/payloadRouter');

module.exports = {
    'test route to transaction': function(beforeExit, assert) {	    
	    
		var payload = "Events": [
        {
            "AddEvent": {
                "account": "darby",
                "object": "sale",
                "fields": [
                    {
                        "name": "partner_id",
                        "value": "null"
                    },
                    {
                        "name": "net_amount",
                        "value": 5
                    },
                    {
                        "name": "gross_amount",
                        "value": 5
                    },
                    {
                        "name": "unique_sale_id",
                        "value": "13026"
                    },
                    {
                        "name": "product_id",
                        "value": "2056"
                    },
                    {
                        "name": "variant_id",
                        "value": "2846"
                    },
                    {
                        "name": "line_number",
                        "value": "174936"
                    },
                    {
                        "name": "quantity",
                        "value": 1
                    },
                    {
                        "name": "sale_date",
                        "value": "20141210T092038Z"
                    },
                    {
                        "name": "customer_id",
                        "value": "null"
                    }
                ]
            }
        }
    ]	    
	    
	    var db = null;
        assert.equal(6, payloadRouter.route(payload,db));
    }
};
