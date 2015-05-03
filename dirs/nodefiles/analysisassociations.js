var express = require('express');
 
var app = express();
 
app.get('/association/', function(req, res) {
	res.send([{name:'association1'}, {name:'association2'}]);
});
 
app.listen(process.env.PORT || 3001);
console.log('Listening on port 3001...'); 
