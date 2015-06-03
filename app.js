var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var markdown = require('markdown-serve');
var aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
var s3 = new aws.S3();

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

app.post('/experiment-data', function(req, res) {
  //db.Entry.create({ data: request.body });
  var params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.body.subject_id + ".csv",
    Body: req.body.data_csv
  };
  s3.putObject(params, function(perr, pres) {
    var text = params.Key + " to bucket " + params.Bucket
    if (perr) {
      console.log("Error uploading ", text, ": ", perr);
    } else {
      console.log("Successfully uploaded ", text);
    }
  });
  res.end();
})

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port %d", server.address().port);
});

