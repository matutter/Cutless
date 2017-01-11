const debug = console.log

$.dropclient = window.dropclient = new (function DropClient() {
  this.version = '0.0.1'
  this.initever = false
  this.tasks = []
  this.node = null 
  var self = this
  
  this.init = function() {
    debug('dropclient', this.version)
    this.initever = true
    this.node = $('#dropnode')
    if(this.node.length != 1) {
      throw Error('Cannot select dropnode node.')
    }
    for(var i = 0; i < this.tasks.length; ++i) {
      var task = this.tasks[i]
      task(this)
    }
    this.tasks.length = 0
    return this
  }

  this.trigger = function(event_name, data) {
    this.node.trigger(event_name, data)
  }
  
  this.on = function(event_name, cb) {
    if(this.node) {
      return this.node.on(event_name, cb)
    } else {
      var callback = this.on.bind(this)
      this.run(function() {
        callback(event_name, cb)
      })
    }
  }
  
  this.run = function(cb) {
    if(this.initever) {
      callback(this)
    } else {
      this.tasks.push(cb)
    }
    return this
  }

  // polyfills

  $.throttle = function(delay, cb) {
    var timeout = null

    return function(evt) {
      if(timeout) {
        return
      } else {
        timeout = setTimeout(function() {
          clearTimeout(timeout)
          timeout = null
          cb(evt)
        }, delay)
      }
    }
  }

})();

$(function() {

  //$.material.options.withRipples: ".btn:not(.withoutripple), .btn:not(.btn-link),.card-image,.navbar a:not(.withoutripple),.dropdown-menu a,.nav-tabs a:not(.withoutripple),.withripple,.pagination li:not(.active):not(.disabled) a:not(.withoutripple)"
  $.material.options.withRipples = [
    '.btn:not(.btn-link)',
    '.card-image',
    '.btn.btn-fab:not(.withoutripple)',
    '.navbar a:not(.withoutripple)',
    '.dropdown-menu a',
    '.nav-tabs a:not(.withoutripple)',
    '.withripple',
    '.pagination li:not(.active):not(.disabled) a:not(.withoutripple)'
  ].join(', ')
  $.material.init()
  $.dropclient.init()
})