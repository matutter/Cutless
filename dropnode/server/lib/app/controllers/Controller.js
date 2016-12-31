const util = require('util')

module.exports.inherits = inherits
module.exports.Controller = Controller

var debug = console.log

/**
* @typedef Controller
* @param app - Reference to app object
*/
function Controller(app, name) {
  this.app = () => app
  this.name = name || 'Controller'
}

Controller.prototype.all = function(route, handler) {
  this.app().all(route, handler.bind(this))
  return this
};

Controller.prototype.get = function(route, handler, next) {
  this.app().get(route, handler.bind(this))
  return this
};

Controller.prototype.use = function(middleware) {
  this.app().use(middleware)
  return this
};

Controller.prototype.post = function(route, handler, next) {
  this.app().post(route, handler.bind(this), next)
  return this
};

Controller.prototype.param = function(route, handler, next) {
  this.app().param(route, handler.bind(this), next)
  return this
};

function inherits(clazz) {
  util.inherits(clazz, Controller)
}