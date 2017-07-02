/**
* Unlike other controllers, the Event controller's only purpose is to subscribe to the events of other controllers
* and make parsable event documents in the events collection.
*/
const inherits = require('../core/Controller.js').inherits;
const debug = require('debug')('app.events.controller');

module.exports = EventController;

function EventController(app) {
  EventController.super_.call(this, app);
  const next = this.errorHandler.bind(this);
  
  debug('attached')
  
  app.users.on('login', function(user, req, e) {
    var msg = `User login for ${user._id} ${e?'failed':'succeeded'}`;
    return this.api.events.users.create({
      issuer: user,
      user: user,
      action: req.url,
      method: req.method,
      result: e ? 0 : 1,
      message: msg
    }).catch(next);
  });
  
  app.users.on('register', function(user, req, e) {
    // user name, there wont be a valid id for an invalid user
    var name = (user ? (user._id ? user._id : user.name) : '???');
    var msg = `User creation for ${name} ${e?'failed':'succeeded'}`;
    return this.api.events.users.create({
      issuer: user,
      user: user,
      action: req.url,
      method: req.method,
      result: e ? 0 : 1,
      message: msg
    }).catch(next);
  });
  
  app.users.on('logout', function(user, req, e) {
    var msg = `User sign out for ${user._id} ${e?'failed':'succeeded'}`;
    return this.api.events.users.create({
      issuer: user,
      user: user,
      action: req.url,
      method: req.method,
      result: e ? 0 : 1,
      message: msg
    }).catch(next);
  });
  
}
inherits(EventController);

EventController.prototype.errorHandler = function(event) {
  debug(event)
}