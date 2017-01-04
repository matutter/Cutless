const util = require('util')
const debug = require('debug')('dn.controller')

module.exports.inherits = inherits
module.exports.Controller = Controller

// prototypes created at runtime
const router_methods = ['param', 'all', 'get', 'post', 'delete', 'put']

/**
* @typedef Controller
* @param app - Reference to app object
*/
function Controller(app) {
  this.app = app.app;
  this.api = app.api;
}

Controller.prototype.use = function(cb) {
  this.app.use(cb)
  return this
}

// creates prototypes for router_methods at runtime
for (var i = 0; i < router_methods.length; ++i) {
  const method_name = router_methods[i]
  
  Object.defineProperty(Controller.prototype, method_name, {
    enumerable: false,
    value: function(route, cb, next_cb) {
      debug(method_name, route) 
      if (next_cb) {
        this.app[method_name](route, cb.bind(this), next_cb.bind(this))
      } else {
        this.app[method_name](route, cb.bind(this))
      }
      
      return this
    }
  })
}

function inherits(clazz) {
  util.inherits(clazz, Controller)
}