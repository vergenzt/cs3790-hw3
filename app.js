//Node is extremely modular - you get dependencies by installing them through NPM as node modules.
//they get saved in your node_modules directory, and you 'attach' them into your application
//through require, in the following way:
var express = require('express'),
    mongoose = require('mongoose');
//Instantiate our application with the Express framework:
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
//This here is necessary because we want to serve just html pages.
//Express works great with templating engines like ejs and jade, which
//you can use to spice up your experiments by e.g. evaluating and passing
//variables inside your html 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Here we tell the app where to find the static jsPsych files - it will resort to this
//when it cannot find the static file it needs from the public folder
app.use('/jsPsych', express.static(__dirname + "/jsPsych"));

//Creating our web server on port 3000
var server = app.listen(3000, function(){
    console.log("Listening on port %d", server.address().port);
});

//The first request is always to the index - '/'. Here, we tell the server
//to respond to this request by rendering the html file containing the 
//go no go experiment.
app.get('/', function(request, response) {
    //We render the front page, passing the userId in the URL:
    response.render('index.html');
})

app.get('/experiment', function(request, response) {
    response.render('go_no_go.html');
})

app.post('/experiment-data', function(request, response){
    console.log('zomagad data post');
    //Parse data from the AJAX call performed as on_finish-callback inside the jsPsych init call
    response.end();//and post that into your database
})

app.get('/finish', function(request, response) {
    response.render('finish.html')
})
