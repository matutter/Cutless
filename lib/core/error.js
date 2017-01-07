module.exports.defineError = defineError;

/**
* Creates an error to be used as an error for a specific API call.
* @param name {String} Name of error. (should be unique)
* @param message {String} Message to display to users.
*/
function defineError(name, message, opts) {

  var DefinedErrorClass = function() {
    this.name = name || 'UnknownError'
    this.message = message || 'An uknown error occured'
    // sets the response statuscode, default is 400 for server errors
    // try to use 4xx and blame the user
    // 400 Bad Request, 401 Unauthorized, 403 Forbidden
    // 404 Not Found, 409 Conflict
    this.status = opts.status || 500
    this.redirect = opts.redirect || undefined
    this.refresh = opts.value || undefined
    this.bubble = true
  }

  DefinedErrorClass.prototype.setRequest = opts.setRequest || setDefinedErrorRequest
  DefinedErrorClass.prototype.setError = opts.setError || setDefinedOriginalError
  DefinedErrorClass.prototype.reject = opts.reject || rejectAsPromise
  
  return DefinedErrorClass
}

function rejectAsPromise() {
  return Promise.reject(this)
}

/**
* Sets the original error that was caught and handled.
* @param error {Error} The error that was caught.
*/
function setDefinedOriginalError(e) {
  this.message = e.message
  return this
}

/**
* Attached to *defineError* errors to add the request which triggered the error for troubleshooting purposes.
* @param request {HttpRequest | HttpsRequest}
*/
function setDefinedErrorRequest(req) {
  this.url = req.url
  this.method = req.method
  return this
}
