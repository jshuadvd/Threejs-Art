var express = require('express');
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 8000;

app.use(bodyParser.text({ type: 'text/html' }));
app.use(cors());

app.use(express.static(path.join(__dirname + '/')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + 'index.html'));
})

app.listen(port, function(){
	console.log("The Server is connected on port 8000!");
});
