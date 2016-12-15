module.exports.Logging = Logging

const winston = require('winston')
const util = require('util')

const Defaults = {
  level : 'debug',
  colorize: true,
}

const CustomLevels = {
  route : winston.levels.debug
}

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  verbose: 'magenta',
  debug: 'green',
  silly: 'blue',
  route: 'blue'
})

/**
* Initiates winston logger from the 'logging' config. Defaults above.
* If no logging config exists console will be the default transport.
* @typedef Logging
* @inherits winston.logger https://www.npmjs.com/package/winston
* @param options - Options for the winston.transports.Console
* @param options.file - Options for the winston.transports.File
*/
function Logging(options) {
  Logging.super_.call(this)

  if(!options) {
    this.add(winston.transports.Console, Defaults)
    this.warn('Configuration "logger" missing; using defaults.')
  } else {

    if(options.off) return

    if(options.level)
      this.level = options.level

    if(options.console)
      this.add(winston.transports.Console, options)

    if(options.file)
      this.add(winston.transports.File, options.file)
  }

  this.setLevels(Object.assign(CustomLevels, winston.levels))
}
util.inherits(Logging, winston.Logger);

/**
* Get a logger attached to the root logger.
* @param name {String} Name of the logger to create, logs are prefixed with this string
*/
Logging.prototype.getLogger = function(name) {
  return this.debug.bind(this, name+' | ')
};
