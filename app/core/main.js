const inherits = require('./Controller.js').inherits

var debug = require('debug')('app.core.main')

module.exports = MainController

function MainController(app) {
  MainController.super_.call(this, app, 'main')
  this.noauth = global.config.noauth || [];
  this.all('*', this.allRequests, this.authorizationGate)
  this.get('/', (req, res) => res.render('home'))
}
inherits(MainController)

MainController.prototype.allRequests = function(req, res, next) {
  if(req.session.user) {
    this.api.users.verifySession(req.session.user).then( user => {

      if(user) {
        req.session.user = user.public();
        res.locals.user = user;
      } else {
        res.locals.user = false;  
      }

      next();
    })
  } else {
    res.locals.session = null;
    next();
  }
};

MainController.prototype.checkNoAuth = function(req) {
  var pathname = req._parsedUrl.pathname
  return this.noauth.includes(pathname)
}

MainController.prototype.authorizationGate = function(req, res, next) {
  if(res.locals.session || this.checkNoAuth(req)) {
    next();
  } else {
    res.status(403).send(`Forbidden: you may not access "${req.url}".`);
  }
};
