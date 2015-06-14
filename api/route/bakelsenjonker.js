var functions = require('../functions.js');
var secret = require('../config/secret.js');

// Set a site-key which is create by Google.
var secret_site_key = secret.site_key_example;

exports.create = function(req, res) {


  if (req.body.required !== undefined ) {
    var required = req.body.required.toString().split(",");
    required.forEach(function(entry) {
      //console.log('##### array -> ' + entry + ": " + req.body[entry]); 
      if (req.body[entry] === '') {
        res.end(JSON.stringify({ registeredSuccessfully: false, reason: "Required field is empty, try again." }));
      }
    });
  }

  functions.verifyRecaptcha(req.body.recaptcha, secret_site_key, function(success) {
    if (success) {
      res.end(JSON.stringify({ registeredSuccessfully: true }));
    } else {
      res.end(JSON.stringify({ registeredSuccessfully: false, reason: "Captcha failed, try again." }));

      // Debug
      //console.log('##### curl --data ' + '"secret=' + secret.site_key + "&response=" + req.body["recaptcha"] + '" https://www.google.com/recaptcha/api/siteverify');

    }
  });

  // Optional is a redirect to a other html page.
  //return res.redirect(req.body.redirect);

}

