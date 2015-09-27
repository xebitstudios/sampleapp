var http      = require('http');

// load the node libraries we need in this example, namely node’s own 
// http library plus the express and mongoose packages we already installed on our EC2 instance
var mongoose  = require('mongoose');
var express   = require('express');

// define variables to represent our express application and our database
var app    = express();
var db;

// define the configuration of the other server instance hosting our database
// replace the HOST in the following variable definition with your database instance’s public DNS
var config = {
  "USER"    : "",           
  "PASS"    : "",
  "HOST"    : "ec2-52-27-82-61.us-west-2.compute.amazonaws.com",  
  "PORT"    : "27017", 
  "DATABASE" : "my_example"
};

// Then define the details for the database we will be connecting to on that instance.
var dbPath  = "mongodb://"+config.USER + ":" + config.PASS + "@" + config.HOST + ":" + config.PORT + "/" + config.DATABASE;

var standardGreeting = 'Hello World!';

var greetingSchema = mongoose.Schema({
  sentence: String
}); 

var Greeting= mongoose.model('Greeting', greetingSchema);

// Our first action on startup is to connect to our Mongo database hosted on the other server
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {
  var greeting;
  Greeting.find( function(err, greetings){
   if( !greetings ){     
      greeting = new Greeting({ sentence: standardGreeting }); 
      greeting.save();
    } 
  }); 
});

app.get('/', function(req, res){
  Greeting.findOne(function (err, greeting) {
    res.send(greeting.sentence);
  });
});

// Set up an Express route to handle any errors
app.use(function(err, req, res, next){
  if (req.xhr) {
    res.send(500, 'Something went wrong!');
  }
  else {
    next(err);
  }
});

// Finally, you need t0 start the Express Webserver:
console.log('starting the Express (NodeJS) Web server');
app.listen(8080);
console.log('Webserver is listening on port 8080');
