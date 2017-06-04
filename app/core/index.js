const mongoose = require('mongoose')
const debug = require('debug')('app.core')
mongoose.Promise = require('bluebird')

/**
* Dropnode core api 
*/
module.exports = Dropnode

const ApiError = global.ApiError = require('./error.js').ApiError
const users = require('../users/api.js')
const events = require('../events/api.js')


/**
* @typedef Dropnode
* The core Dropnode API wrapper.
* @param options {Object*} Options for connecting to mongodb, defaults to localhost:27017/dropsite
*/
function Dropnode(opts) {
  this.port = opts.database.port || 27017
  this.host = opts.database.host || 'localhost'
  this.database = opts.database.database || 'dropsite'  
  this.uri = `mongodb://${this.host}:${this.port}/${this.database}`
  this.users = users;
  this.events = events;
}

/**
* Connects to mongoose to this.uri()
* @return Promise
* @promise - This reference is supplied.
*/
Dropnode.prototype.connect = function() {
  debug(`Connecting to ${this.uri}...`)
  return mongoose.connect(this.uri)
    .then(() => debug(`Connected to %s`, this.uri))
    .return(this)
};