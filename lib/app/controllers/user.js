const inherits = require('./Controller.js').inherits
const debug = require('debug')('dn.controller.user')

module.exports = UserController

function UserController(app) {
  UserController.super_.call(this, app)

  this
		.get('/user/login', (req, res) => res.render('user/login.pug'))
    .get('/user/register', (req, res) => res.render('user/register.pug'))
    .get('/user/account', (req, res) => res.render('user/account.pug'))
		.post('/user/login', this.login)
		.post('/user/login/json', this.login)
		.post('/user/register', this.register)
		.post('/user/register/json', this.register)
}
inherits(UserController)

UserController.prototype.logout = function(req, res, next) {
}

UserController.prototype.login = function(req, res, next) {
  debug('attempting login', req.body)

	this.api.users.login(req.body).then(user => {
		req.session.user = user
		if(req.json) {
			res.json({ action:'/user/login', result:1 })
		} else {
			res.redirect('/')
		}
	}).catch(next)
};

UserController.prototype.register = function(req, res, next) {
	debug('attempting register', req.body)

	this.api.users.register(req.body).then(user => {
		req.session.user = user.public()
		if(req.json) {
			res.json({ action: '/user/register', result:1 })
		} else {
			res.redirect('/')
		}
	}).catch(next)
}
