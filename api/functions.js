var https = require('https');

// Helper function to make API call to recatpcha and check response
exports.verifyRecaptcha = function verifyRecaptcha(key, site_key, callback) {
  https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + site_key + "&response=" + key, function(res) {
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
