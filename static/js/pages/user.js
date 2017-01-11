// js for pages /users/*

function loadHomePage() {
  window.location = '/'
}

$.dropclient.on('/users/login', loadHomePage)
$.dropclient.on('/users/register', loadHomePage)