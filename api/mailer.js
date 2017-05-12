var fs = require('fs');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var https = require('https');

// Set enviroment (development or production)
var config = require('./config/config.js').env();

module.exports = function(req, res) {

  // Debug
  //Object.keys(req.body).forEach(function(key){
  //  console.log('##### body -> ' + key + ": " + req.body[key]); 
  //});

  // First check Form template name
  checkFormTemplateName(req);

  //////////////
  // Funtions //
  //////////////

  function checkFormTemplateName(req) {
    // Get template name from header
    if(req.headers['x-form-template-name'] !== undefined && req.headers['x-form-template-name'] !== "") {

      var form_name = req.headers['x-form-template-name']; 

      // Or get form_name from referer (temporarily disabled).
      //var uri = req.headers.referer.replace(req.headers.origin,""); 
      //var form_name = uri.replace(/(html|htm|php|\/|\.)/g,""); 

      fs.exists(__dirname + '/templates/' + form_name, function (exists) {
        //console.log(exists ? form_name + " template does exists" : form_name + " template does not exits!");
        if(exists){

          // Get subject, from, to, and required fields, error messages, etc.
          var vars = require(__dirname + '/templates/' + form_name + "/vars.json");
          var secret = require(__dirname + '/templates/' + form_name + "/secret.json");

          checkRequiredFields(req,vars,secret);

        } else {
          return res.end(JSON.stringify({ success: false, message: 'Template does not exists!' }));
        }
      });

    } else {
      return res.end(JSON.stringify({ success: false, message: 'Missing x-form-template-name header' }));
    }
  }

  function checkRequiredFields(req, vars, secret) {

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

        checkRecaptcha(req,vars,secret);

      } else {

        //console.log('Required fields are not present!'); 
        return res.end(JSON.stringify({ success: false, message: vars.error.required }));
      }
    } else {

      //console.log('No required fields needed'); 
      checkRecaptcha(req,vars,secret);
    }
  }

  function checkRecaptcha(req, vars, secret) {

    // Debug
    //console.log('# curl --data '+'"secret='+secret.site_key+"&response="+req.body["recaptcha"]+'" https://www.google.com/recaptcha/api/siteverify');

    if (vars.recaptcha) {

      verifyRecaptcha(req.body.recaptcha, secret.site_key, function(success) {

        if (success) {
          //console.log('Captcha success'); 
          sendMail(req, vars);
        } else {
          //console.log('Captcha failure'); 
          res.end(JSON.stringify({ success: false, message: vars.error.captcha }));
        }
      });

    } else {

      //console.log('Recaptcha disabled'); 
      sendMail(req, vars);
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

  function sendMail(req, vars) {
    emailTemplates(__dirname + '/templates', function(err, template) {

      if (err) {
        console.log("function sendMail error:");
        console.log(err);
      } else {

        var transport = nodemailer.createTransport({ 
          port: config.mail_port,
          ignoreTLS: true
        });

        // Send a single email
        template(req.headers['x-form-template-name'], req, function(err, html, text) {
          if (err) {
            console.log("function sendMail template");
            console.log(err);
            res.end(JSON.stringify({ success: false , message: 'Form name error'}));
          } else {
            transport.use('compile', htmlToText());
            transport.sendMail({
              from: vars.envelope.from,
              to: vars.envelope.to,
              cc: vars.envelope.cc,
              bcc: vars.envelope.bcc,
              subject: vars.envelope.subject,
              html: html
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
                console.log("function sendMail transport error:");
                res.end(JSON.stringify({ success: false , message: vars.error.mailserver}));
                return res.sendStatus(500); // Server Error.
              } else {
                console.log("SendMail for " + vars.envelope.from);
                console.dir(responseStatus.response);
                return res.end(JSON.stringify({ success: true, message: responseStatus.response }));
              }
            });
          }
        });
      }
   });
 }

};
