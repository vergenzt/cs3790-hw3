//Node is extremely modular - you get dependencies by installing them through NPM as node modules.
//they get saved in your node_modules directory, and you 'attach' them into your application
//through require, in the following way:
var express = require('express'),
    mongoose = require('mongoose'),
    body_parser = require('body-parser');
//Instantiate our application with the Express framework:
var app = express();

//We are using schemaless Mongoose. Keep in mind that this is not a very good habit, but it 
//works well for our minimalistic purposes where we just want to dump the data into the 
//database and clean it up later. This enables it to work with different plugins that output
//json objects with different parameters, but is a sub-optimal solution. The data you get out
//from these experiments can easily be aggregated and fits well into a relational database format,
//and I've successfully used jsPsych with Sequelize over a MySQL database in the past. This saves
//you a HUGE head ache if you have a longer, more complicated test battery.

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

app.use(body_parser.json()); // to support JSON-encoded bodies
app.use(body_parser.urlencoded({extended: true}));

//This here is necessary because we want to serve just html pages.
//Express works great with templating engines like ejs and jade, which
//you can use to spice up your experiments by e.g. evaluating and passing
//variables inside your html 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//we need to tell express that we want to serve static files
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
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
    console.log(request.body);
    // var entry = new Entry({ iAmNotInTheSchema: true });
    // entry.save() // iAmNotInTheSchema is now saved to the db!!
    //Parse data from the AJAX call performed as on_finish-callback inside the jsPsych init call
    response.end();//and post that into your database
})

app.get('/finish', function(request, response) {
    response.render('finish.html')
})
