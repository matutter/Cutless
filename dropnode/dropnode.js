// Global setup
Promise = require('bluebird')

// ensure server is running here before relative imports
process.chdir(__dirname)

// dropnode libs
const Config = require('./lib/config')
const Logger = require('./lib/logger').Logger
const App = require('./lib/app').App

Config.load('configs').then( config => {
  const logger = new Logger(config.logger)
  const app = new App(config, logger)

  return app.listen().catch(logger.error)
})
.catch(e => {
  console.error('Config load:', e.message, e.stack)
})