$.render = $.render || {}
$.render.alert = $.render.alert || {}
/**
* Render an alert.
* @param options {
*   name {String} Name/title of the alert.
*   message {String} Message content of the alert.
* }
*/
$.render.alert.danger = function(opts) {
  var e = function(tag) { return $(document.createElement(tag)) }
  var el = function(tag, clazz) { return e(tag).addClass(clazz)  }
  
  return el('div', 'alert alert-dismissable alert-danger').append([
    el('button', 'close').attr({type: 'button', 'data-dismiss': 'alert'}).text('×'),
    el('h4','title').text(opts.name),
    el('p', 'message').text(opts.message)
  ])
}
