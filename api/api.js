var express = require('express');

/**************/
// Middleware */
/**************/

// body-parsing middleware to populate req.body.
var bodyParser = require('body-parser');

// CORS - Access-Control-Allow-Origin
var cors = require('cors');

/**************/
// Config     */
/**************/

var config = require('./config/config.js');
var config = config.env();
var corsOptions = { origin: config.cors_url}; 

// Use Express Framework.
var app = express();

// For production use upstream (nginx.conf).
app.listen(config.api_port);

app.use(cors(corsOptions));
app.use(bodyParser.json());

console.log('API (' + config.name + ') is starting on port ' + config.api_port);

// Routes
var routes = {};
routes.bakelsenjonker = require('./route/bakelsenjonker.js');

/*******************/
// Form routes     */
/*******************/

app.post('/mailer/bakelsenjonker', routes.bakelsenjonker.create); 

