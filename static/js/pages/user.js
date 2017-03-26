// js for pages /users/*

function loadHomePage() {
  window.location = '/'
}

// how to response to api-success responses
$.dropclient.on('/users/login', loadHomePage)
$.dropclient.on('/users/register', loadHomePage)
