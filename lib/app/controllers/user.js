const inherits = require('./Controller.js').inherits
const sessions = require('client-sessions')
const debug = require('debug')('user')

module.exports = UserController

function UserController(app) {
  UserController.super_.call(this, app)
  debug('setting up auth')

	var user_sessions = sessions({
		cookieName: 'user_session',
		secret: 'secret123',
		duration: 24 * 60 * 60 * 1000,
		activeDuration: 1000 * 60 * 5
	})

	this.use(user_sessions)
	
  this.post('/user/login', this.login)
		.get('/user/login', (req, res) => res.render('user/login.pug'))
    .get('/user/register', (req, res) => res.render('user/register.pug'))
}
inherits(UserController)

UserController.prototype.login = function(req, res, next) {
  debug('attempted logging', req.body)
  next(null, true)
};
