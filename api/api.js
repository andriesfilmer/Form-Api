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

// Example form 
mailer = require('./mailer.js');
app.post('/example', cors({origin: ['http://localhost:3000','http://example.nl']}), mailer); 

// http://www.bakelsenjonker.nl/p/749/bakels-jonker-boekhoudkantoor-accountancy-contact-opnemen-met-bakels-jonker/index.html
app.post('/bakelsenjonker', cors({origin: ['http://localhost:3000','http://www.bakelsenjonker.nl']}), mailer); 

// http://robertskitesafari.nl -> Booking
app.post('/robertskitesafari', cors({origin: ['http://localhost:3000','http://robertskitesafari.nl']}), mailer); 

