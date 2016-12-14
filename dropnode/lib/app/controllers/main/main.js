const inherits = require('../Controller.js').inherits

module.exports.MainController = MainController

function MainController(app) {
  MainController.super_.call(this, app, 'main')

  this.get('/', this.home)
}
inherits(MainController)

MainController.prototype.home = function(req, res) {
  console.log(res.locals)
  res.render('index.pug')
};