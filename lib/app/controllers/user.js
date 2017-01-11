const inherits = require('./Controller.js').inherits
const debug = require('debug')('dn.controller.user')

module.exports = UserController

function UserController(app) {
  UserController.super_.call(this, app)

  this
		.get('/users/login', (req, res) => res.render('user/login/login.pug'))
    .get('/users/register', (req, res) => res.render('user/login/register.pug'))
    .get('/users/account', (req, res) => res.render('user/account.pug'))
		.post('/users/login', this.login)
		.post('/users/login/json', this.login)
		.post('/users/register', this.register)
		.post('/users/register/json', this.register)
		.post('/users/logout', this.logout)
}
inherits(UserController)

UserController.prototype.login = function(req, res, next) {
  debug('attempting login', req.body)

	if(res.locals.session) {
		return res.json({ action: '/users/login', result: 0 })
	}

	this.api.users.login(req.body).then(user => {
		debug('login for %s success', user.name)

	 	// sets cookie
		req.session.user = user.public()

		if(req.json) {
			res.json({ action:'/users/login', result:1 })
		} else {
			res.redirect('/')
		}
	}).catch(next)
};

UserController.prototype.register = function(req, res, next) {
	debug('attempting register', req.body)

	if(res.locals.session) {
		return res.json({ action: '/users/register', result: 0 })
	}

	this.api.users.register(req.body).then(user => {

		// sets cookie
		req.session.user = user.public()

		if(req.json) {
			res.json({ action: '/users/register', result:1 })
		} else {
			res.redirect('/')
		}
	}).catch(next)
}

UserController.prototype.logout = function(req, res, next) {
	debug('attempting logout', req.body)

	var user = res.locals.user

	this.api.users.logout(req.body, res.locals.user).then(may_logout => {
		
		if(may_logout)
			delete req.session.user

		if(req.json) {
			res.json({ action: '/users/logout', result: (may_logout ? 1: 0) })
		} else {
			res.redirect('/')
		}
	}).catch(next)
}