var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('views', 'views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

mongoose.connect(process.env.CONNECTION || 'mongodb://localhost/jspsych'); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('database opened');
});

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

// routing
app.get('/', function(request, response) {
  response.render('index.html');
});

app.get('/experiment', function(request, response) {
  response.render('go_no_go.html');
});

app.get('/finish', function(request, response) {
  response.render('finish.html');
})

app.post('/experiment-data', function(request, response) {
  Entry.create({ data: request.body });  
  response.end();
})

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port %d", server.address().port);
});

