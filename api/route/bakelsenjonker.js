var https = require('https');
var secret = require('../config/secret.js');

exports.create = function(req, res) {

  verifyRecaptcha(req.body.recaptcha, function(success) {
    if (success) {
      res.end(JSON.stringify({ registeredSuccessfully: true }));
    } else {
      res.end(JSON.stringify({ registeredSuccessfully: false, reason: "Captcha failed, try again." }));
      // Debug
      //console.log('##### test -> failed'); 
      //console.log('##### curl --data ' + '"secret=' + secret.site_key + "&response=" + req.body["recaptcha"] + '" https://www.google.com/recaptcha/api/siteverify');
    }

  });

  // Optional is a redirect to a other html page.
  //return res.redirect(req.body.redirect);

}

// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + secret.site_key + "&response=" + key, function(res) {
                var data = "";
                res.on('data', function (chunk) {
                        data += chunk.toString();
                });
                res.on('end', function() {
                        try {
                                var parsedData = JSON.parse(data);
                                callback(parsedData.success);
                        } catch (e) {
                                callback(false);
                        }
                });
        });
}
