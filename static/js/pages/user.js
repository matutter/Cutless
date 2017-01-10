// js for pages /user/*

function loadHomePage() {
  window.location = '/'
}

$.dropclient.on('/user/login', loadHomePage)
$.dropclient.on('/user/register', loadHomePage)