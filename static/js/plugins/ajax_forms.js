
if(!window.dropclient) throw Error('This module must be loaded after dropclient.js!')

$.dropclient.run(function(client) {

  var onFailure = function(xhr, status, e) {
    var res = xhr.responseJSON
    if(res && res.bubble)
      $(this).find('.alert-target').empty().append($.render.alert.danger(res))
    else
      console.error('No handler found for error', e)
  }
  
  var onSuccess = function(data, status, xhr) {
    $.dropclient.trigger(data.action, data)
  }
  
  $('form').toArray().map($).forEach(function(form) {
    form.find('button').click(function(evt) {
      evt.preventDefault()
  
      // request only JSON responses
      var url = form.prop('action') + '/json' 
      var method = form.prop('method')
      var data = form.serialize()

      form.find('.alert-target').empty()
      
      $.ajax({
        type: method,
        url: url,
        data: data,
        dataType: 'json',
        context: form
      }).done(onSuccess)
        .fail(onFailure);
    })
  })  
  
})