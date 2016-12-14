module.exports.Logger = Logger

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
* @typedef Logger
* @inherits winston.logger https://www.npmjs.com/package/winston
* @param opts - Options for the winston.transports.Console
* @param opts.file - Options for the winston.transports.File
*/
function Logger(opts) {
  Logger.super_.call(this)

  if(!opts) {
    this.add(winston.transports.Console, Defaults)
    this.warn('Configuration "logger" missing; using defaults.')
  } else {

    if(opts.off) return

    if(opts.level)
      this.level = opts.level

    if(opts.console)
      this.add(winston.transports.Console, opts)

    if(opts.file)
      this.add(winston.transports.File, opts.file)
  }

  this.setLevels(Object.assign(CustomLevels, winston.levels))
}
util.inherits(Logger, winston.Logger);
