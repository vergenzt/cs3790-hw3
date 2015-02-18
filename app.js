var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
//This here is necessary because we want to serve just html pages.
//Express works great with templating engines like ejs and jade, which
//you can use to spice up your experiments by e.g. evaluating and passing
//variables inside your html 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//tell app where to find the static jsPsych files - it will resort to this
//when it cannot find the static file it needs from the public folder
app.use('/jsPsych', express.static(__dirname + "/jsPsych"));


var server = app.listen(3000, function(){
    console.log("Listening on port %d", server.address().port);
});

//The first request is always to the index - '/'. Here, we tell the server
//to respond to this request by rendering the html file containing the 
//go no go experiment.
app.get('/', function(request, response) {
    response.render('go_no_go.html')
})