var nodemailer = require('nodemailer');
var https = require('https');
var juice = require('juice');

var secret = require('../config/secret.js');
var config = require('../config/config.js');
var config_env = config.env();

exports.create = function(req, res) {

// Envelope vars
var envelope = {
      "from": "andries@filmer.nl",
      "to": ["andries@inzetrooster.nl"],
      "bcc": ["andries@filmer.nl"],
      "subject": "Booking from roberstkitesafari.nl",
      "required": ['fullname','phone','email']
}

// Error messages
var error = {
      "required": "Required field is empty, please try again.",
      "captcha": "Robot check failed, please try again."
}

// Mail body
var html =  '<html>\n';
    html += '<body>\n';
    html += '<head>\n';
    html += '<style>\n';
    html += '.main{width:100%;max-width:600px;font-family:sans-serif}\n';
    html += 'caption, .footer{background-color:#3D2708;color:#ffffff;margin:10px 0;padding:5px}\n';
    html += '.footer{font-size: 0.7em;}\n';
    html += '.header,.footer{margin:10px 0;}\n';
    html += 'table{width:100%;}\n';
    html += 'tr{background-color:#eeeeee;padding:5px}\n';
    html += '.pre{white-space: pre;}\n';
    html += '</style>\n';
    html += '</head>\n';
    html += '<div class="main">\n';
    html += '<table>\n';
    html += '<h2>Booking Robert\'s kitesafari</h2>\n';
    html += '<caption>Booking from website</caption>\n';
    html += '<tr><td>Name</td><td>' + req.body.fullname + '</td></tr>\n';
    html += '<tr><td>E-mail</td><td>' + req.body.email + '</td></tr>\n';
    html += '<tr><td>Phone</td><td>' + req.body.phone + '</td></tr>\n';
    html += '<tr><td>City</td><td>' + req.body.city + '</td></tr>\n';
    html += '<tr><td>Country</td><td>' + req.body.country + '</td></tr>\n';
    html += '<tr><td>Comments</td><td class="pre">' + req.body.question + '</td></tr>\n';
    html += '<tr><td>Arrival date</td><td>' + req.body.arrival + '</td></tr>\n';
    html += '<tr><td>Departure date</td><td>' + req.body.departure + '</td></tr>\n';
    html += '</table>\n';
    html += '</div>\n';
    html += '</body>\n';
    html += '</html>\n';

///////////////////////////////////////////////////////////////////////////////

  // Check required fields
  if (envelope.required !== undefined ) {
    var required = envelope.required.toString().split(",");
    required.forEach(function(entry) {
      console.log('##### required -> ' + entry + ": " + req.body[entry]); 
      if (req.body[entry] === '' || req.body[entry] === undefined) {
        console.log('!!!!! required -> ' + entry); 
        res.end(JSON.stringify({ submitSuccessfully: false, reason: error.required }));
      }
    });
  }

  verifyRecaptcha(req.body.recaptcha, secret.site_key, function(success) {
    if (success) {
      res.end(JSON.stringify({ submitSuccessfully: true }));
      sendEmail(envelope, html);
    } else {
      res.end(JSON.stringify({ submitSuccessfully: false, reason: error.captcha }));
      //console.log('##### curl --data ' + '"secret=' + secret.site_key + "&response=" + req.body["recaptcha"] + '" https://www.google.com/recaptcha/api/siteverify');
    }
  });


  function verifyRecaptcha(key, site_key, callback) {
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

  function sendEmail(envelope, html) {

    var juiced = juice(html) ;

    var transporter = nodemailer.createTransport({ 
      port: config_env.mail_port,
      ignoreTLS: true
    });

    transporter.sendMail({
        from: envelope.from,
        to: envelope.to,
        bcc: envelope.bcc,
        subject: envelope.subject,
        html: juiced
    });

    console.log('Send reminder to: ' + envelope.to); 

  }

}
