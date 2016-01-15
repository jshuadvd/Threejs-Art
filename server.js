var express = require('express');
// var cors = require('cors');
var path = require('path');
// var bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 8000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(bodyParser.text({ type: 'text/html' }));
// app.use(cors());

app.use(express.static(path.join(__dirname + '/')));


app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + 'index.html'));
})

app.listen(port, function(){
	console.log("The Server is connected on port 8000!");
});
