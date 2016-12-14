const inherits = require('../Controller.js').inherits
const passport = require('passport')
const LocalStrategy = require('passport-local')

module.exports.UserController = UserController

var debug = console.log

function UserController(app) {
  UserController.super_.call(this, app)
  debug = app.getLogger('User')
  debug('setting up auth')

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true
  }, this.login.bind(this)))

  this.get('/login', (req, res) => res.render('login/login.pug'))
    .get('/register', (req, res) => res.render('login/register.pug'))

    .use(passport.initialize())
    .use(passport.session())
    .post('/login',
      passport.authenticate('local', { failureRedirect: '/login' }),
      (req, res) => res.redirect('/')
    )
}
inherits(UserController)

UserController.prototype.login = function(email, password, next) {
  debug('attempted logging', email, password)
  next(null, true)
};
