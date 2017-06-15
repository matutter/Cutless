
$.ajax({
  url : '/api/users/logout',
  method: 'post'
}).done(function() {
  
  window.location.href = '/';
  
});