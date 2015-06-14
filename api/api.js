var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var config = require('./config/config.js');
var config = config.env();
var whitelist = config.cors_url;
var corsOptionsDelegate = function(req, callback){
  var corsOptions;
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// Use Express Framework.
var app = express();

// For production use upstream (nginx.conf).
app.listen(config.api_port);

app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json());

console.log('API (' + config.name + ') is starting on port ' + config.api_port);

// Routes
var routes = {};

// bakelsenjonker.nl form
routes.bakelsenjonker = require('./route/bakelsenjonker.js');
app.post('/mailer/bakelsenjonker', routes.bakelsenjonker.create); 

