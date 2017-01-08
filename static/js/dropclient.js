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
})();

$(function() {
  $.material.init()
  $.dropclient.init()
})