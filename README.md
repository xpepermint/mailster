# mailster

[![NPM version](https://badge.fury.io/js/mailster.svg)](http://badge.fury.io/js/mailster)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/mailster.svg)](https://gemnasium.com/xpepermint/mailster)

Advanced mailer for NodeJS, built on top of [nodemailer](https://github.com/andris9/Nodemailer).
With mailster you can send emails using multiple `nodemailer` transports. You can use all `nodemailer` features and plugins but in a nice structured way.

## Installation

Install the [npm](https://www.npmjs.org/package/mailster) package.

```
npm install mailster --save
```

## Configuration

Mail transports should be defined in a separated file. The module will try to load `config/mailers.js` file by default. We can change the default behavior on module initialization. The best place to configure the module is the application's main file.

```js
// index.js
var _ = require('mailster').load({
  // configuration file path
  configPath: 'my/config/path.js',
  // custom logger (set to `false` by default)
  logger: console.log
});
```

This will populate `_.transports` attribute with transports defined in the
configuration file. The configuration file should look something like the
example bellow.

```
// config/mailers.js
module.exports = {
  default: {

    'simple': {
      service: 'Gmail',
      auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
      }
    },

    'advanced': require('nodemailer-smtp-pool')({
      service: 'Gmail',
      auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
      },
      maxConnections: 5,
      maxMessages: 10,
      debug: true
    })

  },
  production: {}
};
```

## Usage

When configured, you send an email by calling the `send` method on one of
the available transports.

```js
var _ = require('mailster');
_.transports.default.send({
  from: 'Tester ✔ <me@google.com>',
  to: 'you@google.com',
  subject: 'Hello ✔',
  text: 'Hello world ✔',
  html: '<div>Hello world ✔</div>'
});
```
