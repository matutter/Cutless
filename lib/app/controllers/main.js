const inherits = require('./Controller.js').inherits

var debug = require('debug')('sd.app.controller.main')

module.exports = MainController

function MainController(app) {
  MainController.super_.call(this, app, 'main')

  this.get('/', this.home)
}
inherits(MainController)

MainController.prototype.home = function(req, res) {
  res.render('index.pug')
};