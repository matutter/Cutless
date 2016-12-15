/**
* Dropnode core api 
*/
module.exports.Dropnode = Dropnode

//const user = require('user')
const Database = require('./db.js').Database
const Logging = require('./logging.js').Logging

/**
* @typedef Dropnode
* The core Dropnode API wrapper.
* @param options {Object*} Options for connecting to mongodb, defaults to localhost:27017/dropnode
*/
function Dropnode(options) {
  options = options || {}
  this.logging = new Logging(options.logging || {} )
  this.db = new Database(options.db || {})

  this.user = null

  // attach utility functions
  this.getLogger = this.logging.getLogger
}