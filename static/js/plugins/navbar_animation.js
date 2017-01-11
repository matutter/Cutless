// Adds the scroll listener to the #main-content and shows the #navbar-shadow
// When content is scrolled under navbar

if(!window.dropclient) throw Error('This module must be loaded after dropclient.js!')

$.dropclient.run(function(client) {
  var offset = 70
  var main = $('#main-content')
  var shadow = $('#navbar-shadow')

  // bail out, elements not on page
  if(!main.length || !shadow.length) {
    return
  }

  main.on('scroll', $.throttle(80, transition))

  function transition() {
    shadow.css({opacity: (main.scrollTop() > offset) ? 1 : 0})
  }

})