# API for sending html forms.

This API will accept html forms and e-mail them.

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
live [robertskitesafari.nl](http://robertkitesafari.nl)

## Install server-side

    cd api
    npm install

### Config

Copy `api/example/` directorie to other `api/x-form-template-name/` directorie.

Set your config in `api/x-form-template-name/vars.json` file.

### Re-Captcha secrets

If you enable `re-captcha` then you have to create your Re-Captcha keys 
on [Google re-captcha](https://www.google.com/recaptcha/).

Create a file `api/[x-form-template-name]/secret.json` which is not in Github (.gitignore)

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
