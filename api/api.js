var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// Set enviroment (development or production)
var config = require('./config/config.js').env();

// Use Express Framework.
var app = express();

// For production use upstream (nginx.conf).
app.listen(config.api_port);
console.log('API (' + config.name + ') is starting on port ' + config.api_port);

app.use(bodyParser.json());

// include OPTIONS pre call.
app.options('*', cors());
mailer = require('./mailer.js');
app.post('/mailer', cors(), mailer); 

