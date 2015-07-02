# API for sending html forms.

This API accepts html forms and send a e-mail.

## Features

- On the client-side you only need javascript (XMLHttpRequest).
- You can use 'required' fields with nice feedback.
- You can use 're-captcha' for validate humans vs robots.
- On de server-side you can make mail templates with `jade`.
- Its send plain text and html mails.

## Install client-side

Look voor examples in the `examples` directorie.

- Set `x-form-template-name`.
- Set `params` as the fieldnames in your form.
- Create the html form as you like.
- Add `required` class to fields for better feedback.

There is also a AngularJs implementation which you can find on 
[Github](https://github.com/andriesfilmer/robertskitesafari) or 
live [robertskitesafari.nl](http://robertskitesafari.nl) -> Booking form.

## Install server-side

    cd api
    npm install

### Config

Copy `api/templates/example/` directorie to other `api/templates/[x-form-template-name]/` directorie.

Set your config in `api/x-form-template-name/vars.json` file.

Add your host/website to the whitelist `api/config/whitelist.json`

### Re-Captcha secrets

If you enable `re-captcha` in `vars.json` then you have to create your Re-Captcha keys 
on [Google re-captcha](https://www.google.com/recaptcha/).

Create a file `api/[x-form-template-name]/secret.json` which is not in Github (i.o. .gitignore)

    {
      "site_key": "--your-secret-key-from-google-recaptcha--"
    }

## Production

Read `nginx.conf` for you webserver config.

### Crontab

Restart your api after reboot.

    NODE_ENV=production;/usr/local/bin/forever start --sourceDir /var/www/form-api.filmer.net/current/api api.js >> /var/www/form-api.filmer.net/current/api/log/forever 2>&1

## Resources

- https://jaxbot.me/articles/new-nocaptcha-recaptcha-with-node-js-express-12-9-2014
