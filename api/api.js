var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// Set enviroment (development or production)
var config = require('./config/config.js');
var config_env = config.env();

// Only allow request from cors_url (set in env.json)
var whitelist = config_env.cors_url;
var corsOptionsDelegate = function(req, callback) {
  var corsOptions;
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// Get secret (site_key) not in github.
var secret = require('./config/secret.js');

// Use Express Framework.
var app = express();

// For production use upstream (nginx.conf).
app.listen(config_env.api_port);
console.log('API (' + config_env.name + ') is starting on port ' + config_env.api_port);
console.log('Cors ' + config_env.cors_url);

app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json());

// Routes
var routes = {};

// Example form 
routes.example = require('./route/example.js');
app.post('/mailer/example', routes.example.create); 

// http://www.bakelsenjonker.nl/p/749/bakels-jonker-boekhoudkantoor-accountancy-contact-opnemen-met-bakels-jonker/index.html
routes.bakelsenjonker = require('./route/bakelsenjonker.js');
app.post('/mailer/bakelsenjonker', routes.bakelsenjonker.create); 

