'use strict';

/**
 * Module dependencies.
 */

var _ = require('config-keys')
var nm = require('nodemailer');

/**
 * Return logger function.
 *
 * @param {object|boolean} logger
 * @return {function}
 */

function buildLogger(logger) {
  if (logger == true) {
    return function(e) { console.log(e.type, e.message) };
  } else if (typeof logger == 'function') {
    return function(e) { logger(e.type, e.message) };
  }
  return null;
}

/**
 * Return mail transport object.
 *
 * @param {object} mailer
 * @param {object} logger
 * @return {object}
 */

function buildTransport(mailer, logger) {
  // attaching log event (if available)
  if (logger &&  mailer.on) {
    mailer.on('log', logger);
  }
  // converting to transport object
  var transport = nm.createTransport(mailer);
  // custom send mehtod
  transport.send = function(opts, next) {
    this.sendMail(opts, function(err, info) {
      if (logger) logger({ type: 'mail', message: JSON.stringify({ from: opts.from, to: opts.to, subject: opts.subject }) });
      if(err && logger) logger({ type: 'error', message: err });
      else if (logger) logger({ type: 'sent', message: info.response });
      if (next) cb(err, info);
    });
  };
  // returning transport
  return transport;
}

/**
 * Module.
 */

module.exports = {

  /**
   * Loaded mail transports.
   *
   * @api public
   */

  transports: {},

  /**
   * Loads mail transports.
   *
   * @param {object} options
   * @api public
   */

  load: function(options) {
    if (!options) options = {}
    // reading configuration data
    var config = _.read(options.configPath || process.cwd()+'/config/mailers.js');
    // logger function
    var logger = buildLogger(options.logger);
    // loading transports
    Object.keys(config).forEach(function(name) {
      this.transports[name] = buildTransport(config[name], logger);
    }.bind(this));
  }
};
