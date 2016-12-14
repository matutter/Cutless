module.exports.Database = Database

const mongoose = require('mongoose')
mongoose.Promise = Promise

/**
* @typedef Database
* @param opts - Mongoose uri options
* @param opts.port - MongoDB port
* @param opts.host - Hostname for MongoDB server, or IP
* @param opts.database - Database name
*/
function Database(opts, logger) {
  if(!opts)
    throw new Error('Missing configuration')

  this.port = opts.port || 27017
  this.host = opts.host || 'localhost'
  this.database = opts.database || 'dropnode'

  this.model = mongoose.model
  this.Schema = mongoose.Schema
  this.debug = logger.debug.bind(logger, 'DB:')
  this.error = logger.error.bind(logger, 'DB:')
}

/**
* Formats the database port, host, and name as described in the mongoose docs
* Reference, http://mongoosejs.com/docs/connections.html 
* @return - Mongoose connect uri
*/
Database.prototype.uri = function() {
  return `mongodb://${this.host}:${this.port}/${this.database}`
};

/**
* Connects to mongoose to this.uri()
* @return Promise
* @promise - This reference is supplied.
*/
Database.prototype.connect = function() {
  const uri = this.uri()

  this.debug(`Connecting to ${uri}...`)
  return mongoose.connect(uri).then(() => {
    this.debug(`Connected`)
    return this
  })
};