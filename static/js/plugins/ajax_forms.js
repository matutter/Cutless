
if(!window.dropclient) throw Error('This module must be loaded after dropclient.js!')

$.dropclient.run(function(dc) {
  
  function onSuccess(data, status, xhr) {
    console.log('success', data, status, xhr)
  }
  
  function onFail(xhr, status, error) {
    console.log('error', xhr, status, error)
  }
    
  $('form').toArray().map($).forEach(function(form) {
    form.find('button').click(function(evt) {
      evt.preventDefault()
  
      var url = form.prop('action')
      var method = form.prop('method')
      var data = form.serialize()
      
      $.ajax({
        type: method,
        url: url,
        data: data,
        dataType: 'json'
      }).done(onSuccess).fail(onFail);
      
    })
  })
  
})