# API for sending contact forms.
# Form-Mailer-Api

# Re-Captcha secrets

Create your Re-Captcha keys on [Google re-captcha](https://www.google.com/recaptcha/).

Add a file `api/config/secret.js` With:

    exports.site_key_example = "--your-secret-site-key--";
    exports.site_key_other_site = "--your-secret-site-key--";

## Call the API from your form

- For development use: `http://localhost:3002`
- For production use: `http://mailer-form-api.filmer.net/route/...` or
- For production use: `https//mailer-form-api.filmer.net/route/...`

Read `nginx.conf` for you webserver config.

## Crontab

    NODE_ENV=production;/usr/local/bin/forever start --sourceDir /var/www/form-mailer-api.filmer.net/current/api api.js >> /var/www/form-mailer-api.filmer.net/current/api/log/forever 2>&1

## Resources

- https://jaxbot.me/articles/new-nocaptcha-recaptcha-with-node-js-express-12-9-2014
