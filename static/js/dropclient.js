const debug = console.log

$.dropclient = window.dropclient = new (function DropClient() {
  this.version = '0.0.1'
  this.initever = false
  this.tasks = []

  function handleError(xhr, status, e) {
    console.log('Error', e, xhr.status)
    if(xhr.responseJSON) {
      var res = xhr.responseJSON
      console.log(res)
    }
    //console.log(xhr, status, e)    
  }
  
  this.handleError = handleError.bind(this)
  
  this.init = function() {
    debug('dropclient', this.version)
    this.initever = true
    for(var i = 0; i < this.tasks.length; ++i) {
      var task = this.tasks[i]
      task(this)
    }
    this.tasks.length = 0
    return this
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