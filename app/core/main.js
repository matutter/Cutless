const inherits = require('./Controller.js').inherits

var debug = require('debug')('app.core.main')

module.exports = MainController

function MainController(app) {
  MainController.super_.call(this, app, 'main')

  this.get('/', this.home)
}
inherits(MainController)

MainController.prototype.home = function(req, res) {
  res.render('index.pug')
};