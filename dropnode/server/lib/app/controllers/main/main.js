const inherits = require('../Controller.js').inherits

var debug = require('debug')('app.main')

module.exports.MainController = MainController

function MainController(app) {
  MainController.super_.call(this, app, 'main')

  this.get('/', this.home)
}
inherits(MainController)

MainController.prototype.home = function(req, res) {
  debug('locals=%o', res.locals)
  res.render('index.pug')
};