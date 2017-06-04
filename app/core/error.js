module.exports.ApiError = ApiError;

/**
* Creates an error to be used as an error for a specific API call.
* @param name {String} Name of error. (should be unique)
* @param message {String} Message to display to users.
*/
function ApiError(name, message, opts) {

  const ApiErrorClass = function() {
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

  ApiErrorClass.prototype.setRequest = opts.setRequest || setApiErrorRequest
  ApiErrorClass.prototype.setError = opts.setError || setApiOriginalError
  ApiErrorClass.prototype.reject = opts.reject || rejectAsPromise
  
  return ApiErrorClass
}

function rejectAsPromise() {
  return Promise.reject(this)
}

/**
* Sets the original error that was caught and handled.
* @param error {Error} The error that was caught.
*/
function setApiOriginalError(e) {
  this.message = e.message
  //this.original_error = e;
  return this
}

/**
* Attached to *ApiError* errors to add the request which triggered the error for troubleshooting purposes.
* @param request {HttpRequest | HttpsRequest}
*/
function setApiErrorRequest(req) {
  this.url = req.url
  this.method = req.method
  return this
}
