// Global setup
Promise = require('bluebird')

// ensure server is running here before relative imports
process.chdir(__dirname)

process.env['DEBUG'] = 'app*,db,user,route'

// dropnode libs
const Config = require('./lib/config')
const App = require('./lib/app').App
const core = require('./lib/core')

Config.load('configs').then( config => {
  const api = new core.Dropnode({
    db: config.database,
    logging: config.logging
  })
  const app = new App(config, api)

  return app.listen()
})
.catch(e => {
  console.error(e.message, e.stack)
})