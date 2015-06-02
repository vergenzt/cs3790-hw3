var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var markdown = require('markdown-serve');

var app = express();
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.static('lib'));
app.use(express.static('experiments'));
app.use('/md', markdown.middleware({
  rootDirectory: 'markdown/',
  handler: function(mdFile, req, res, next) {
    res.send(mdFile.parseContent());
  }
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.redirect('/experiment.html');
});

var db = require('./db');
app.post('/experiment-data', function(request, response) {
  db.Entry.create({ data: request.body });  
  response.end();
})

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port %d", server.address().port);
});

