
function goHome() {
  window.location.href = '/';
}

setTimeout(function() {

  console.log("Logging out user...");
  $.ajax({
    url : '/users/logout/json',
    method: 'post'
  })
  .done(goHome)
  .fail(function(e) {
    $('#log-out-message').text(e.responseText);
    $('.fa-spin').removeClass('fa-spin');
    setTimeout(goHome, 2000);
  });
  
}, 1000)

