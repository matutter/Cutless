const debug = console.log
dc = new (function DropClient(){
  this.version = '0.0.1'
    
})()


$(function() {
  $.material.init()
  debug('dropclient', dc.version)
})