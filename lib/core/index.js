const mongoose = require('mongoose')
const debug = require('debug')('dn.core')
mongoose.Promise = require('bluebird')

/**
* Dropnode core api 
*/
module.exports = Dropnode

const defineError = global.defineError = require('./error.js').defineError
const users = require('./users.js')

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
  this.users = users 
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