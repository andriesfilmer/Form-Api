// Take a look in `env.json` form enviroment vars.
var env = require('./env.json');

exports.env = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return env[node_env];
};


