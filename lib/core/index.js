const mongoose = require('mongoose')
const debug = require('debug')('dn.api')
mongoose.Promise = require('bluebird')

/**
* Dropnode core api 
*/
module.exports.Dropnode = Dropnode

//const user = require('user')
const users = require('./users.js')

/**
* @typedef Dropnode
* The core Dropnode API wrapper.
* @param options {Object*} Options for connecting to mongodb, defaults to localhost:27017/dropnode
*/
function Dropnode(options) {
  this.port = options.port || 27017
  this.host = options.host || 'localhost'
  this.database = options.database || 'dropnode'  
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