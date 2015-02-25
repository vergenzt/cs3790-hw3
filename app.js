//Node is extremely modular - you get dependencies by installing them through NPM as node modules.
//they get saved in your node_modules directory, and you 'attach' them into your application
//through require, in the following way:
var express = require('express'),
    mongoose = require('mongoose'),
    body_parser = require('body-parser');
//Instantiate our application with the Express framework:
var app = express();

//This here is necessary because we want to serve just html pages.
//Express works great with templating engines like ejs and jade, which
//you can use to spice up your experiments by e.g. evaluating and passing
//variables inside your html 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// ------- MIDDLEWARE AND CONFIGURATION

//we need to tell express that we want to serve static files
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
//Here we tell the app where to find the static jsPsych files - it will resort to this
//when it cannot find the static file it needs from the public folder
app.use('/jsPsych', express.static(__dirname + "/jsPsych"));
//These middleware allow us to parse data from the request body sent to app.js in the AJAX call 
//done in the on_finish callback where you define your jsPsych experiment.
app.use(body_parser.json()); // to support JSON-encoded bodies
app.use(body_parser.urlencoded({extended: true}));


// ------- SERVER CONFIG

//We are using schemaless Mongoose. Keep in mind that this is not a very good habit, but it 
//works well for our minimalistic purposes where we just want to dump the data into the 
//database and clean it up later. This enables it to work with different plugins that output
//json objects with different parameters, but is a sub-optimal solution. The data you get out
//from these experiments can easily be aggregated and fits well into a relational database format,
//and I've successfully used jsPsych with Sequelize over a MySQL database in the past. This saves
//you a HUGE head ache once you get to analysis, if you have a longer, more complicated test battery.

//opening mongoose connection 
LocalMongoConnectionString = 'mongodb://localhost/jspsych';
ProductionMongoConnectionString = 'mongodb://tuuli:FullStackJavaScript1337@ds031601.mongolab.com:31601/jspsych_db';

mongoose.connect(ProductionMongoConnectionString); //change this to local if you're working with local connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

// ------- STARTING THE SERVICE

//Creating our web server on port 3000
var server = app.listen(3000, function(){
    console.log("Listening on port %d", server.address().port);
});

// ------- ROUTING

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

// ------- POST REQUEST - WRITING TO THE DB

app.post('/experiment-data', function(request, response){
    //request.body contains data from the AJAX call performed as on_finish-callback inside the jsPsych init call (in your html file)
    Entry.create({
        //the user agent string contains all kinds of useful information (OS and browser)
        "user_agent": request.headers['user-agent'],
        "data":request.body
    });    
    response.end();
})

app.get('/finish', function(request, response) {
    response.render('finish.html')
})
