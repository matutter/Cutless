/**
* Dropnode core api 
*/
module.exports.Dropnode = Dropnode

//const user = require('user')
const Database = require('./db.js').Database

/**
* @typedef Dropnode
* The core Dropnode API wrapper.
* @param options {Object*} Options for connecting to mongodb, defaults to localhost:27017/dropnode
*/
function Dropnode(options) {
  options = options || {}
  this.db = new Database(options.db || {})

  this.user = null
}