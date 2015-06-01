var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use(express.static('experiments'));
app.use(bodyParser.json());

var db = require('./db');
app.post('/experiment-data', function(request, response) {
  db.Entry.create({ data: request.body });  
  response.end();
})

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port %d", server.address().port);
});

