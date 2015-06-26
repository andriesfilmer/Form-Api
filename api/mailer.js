var emailTemplates = require('email-templates');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var nodemailer = require('nodemailer');
var https = require('https');

// Set enviroment (development or production)
var config = require('./config/config.js').env();

exports.create = function(req, res) {

  // Debug
  //Object.keys(req.body).forEach(function(key){
  //  console.log('##### body -> ' + key + ": " + req.body[key]); 
  //});

  // Get template name from header or referer
  if(req.headers['x-form-name'] !== undefined) {
    var form_name = req.headers['x-form-name']; 
  } else {
    var uri = req.headers.referer.replace(req.headers.origin,""); 
    var form_name = uri.replace(/(html|htm|php|\/|\.)/g,""); 
  }

  // Get subject, from, to, and required fields, error messages, etc.
  var vars = require('./templates/' + form_name + "/vars.json");
  var secret = require('./templates/' + form_name + "/secret.json");

  // Check required fields
  if (vars.required !== undefined && vars.required !== "") {
    var requiredFields = true;
    var required = vars.required.toString().split(",");
    required.forEach(function(entry) {
      //console.log('Required -> ' + entry + ": " + req.body[entry]); 
      if (req.body[entry] === '' || req.body[entry] === undefined) {
        requiredFields = false; 
      }
    });

    if (requiredFields) { 
      // Debug
      //console.log('Required fields are present.'); 
      //console.log('# curl --data '+'"secret='+secret.site_key[form_name]+"&response="+req.body["recaptcha"]+'" https://www.google.com/recaptcha/api/siteverify');
      checkReCaptcha();
    }
    else {
      console.log('Required fields are not present!'); 
      res.end(JSON.stringify({ success: false, message: vars.error.required }));
    }
  }
  else {
    console.log('Required disabled!'); 
    checkReCaptcha();
  }

  function checkReCaptcha() {
    if (vars.recaptcha) {
      verifyRecaptcha(req.body.recaptcha, secret.site_key[form_name], function(success) {
        if (success) {
          //console.log('Captcha success: ' + success); 
          sendMail();
        } else {
          //console.log('Captcha failure :' + success); 
          res.end(JSON.stringify({ success: false, message: vars.error.captcha }));
        }
      });
    }
    else {
      console.log('Recaptcha disabled'); 
      sendMail();
      res.end(JSON.stringify({ message: "Re-captach disabled!" }));
    }
  }


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

  function sendMail() {
    //console.log('Jump into sendMail function.'); 
    emailTemplates('templates', function(err, template) {

      if (err) {
        console.log(err);
        res.end(JSON.stringify({ success: false , message: 'Template error'}));
      } 
      else {

        var transport = nodemailer.createTransport({ 
          port: config.mail_port,
          ignoreTLS: true
        });

        // Send a single email
        template(form_name, req, function(err, html, text) {
          if (err) {
            console.log(err);
            res.end(JSON.stringify({ success: false , message: 'Form name error'}));
          } else {
            transport.use('compile', htmlToText({tables:['.blater']}));
            transport.sendMail({
              from: vars.envelope.from,
              to: vars.envelope.to,
              cc: vars.envelope.cc,
              subject: vars.envelope.subject,
              html: html
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
                res.end(JSON.stringify({ success: false , message: vars.error.mailserver}));
                return res.sendStatus(500); // Server Error.
              } else {
                console.dir(responseStatus.response);
                res.end(JSON.stringify({ success: true }));
              }
            });
          }
        });
      }
   });
 }

};
