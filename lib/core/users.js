const debug = require('debug')('ds.api.users')
const validators = require('validator')
const mongoose = require('mongoose')
const Schema = require('./schemas').user

const User = mongoose.model('User', Schema);

const LoginUsernameError = defineError(
  'Unknown Email', 
  'The email you entered doesn\'t belong to an account. Please check your email and try again.', {
  status: 404,
})
const LoginPasswordError = defineError(
  'Incorrect Password',
  'Sorry, your password was incorrect. Please double-check your password.', {
  status: 401,
})
const NoSuchUser = defineError(
  'No such user',
  'The user specified does not exist', {
  status: 404
})
const RegistrationError = defineError(
  'Registration Error', null, {
    setError : function(e) {
      // mongo db duplicate code error
      if(e.code == 11000) {
        this.message = 'That username is not available, please try a different name.'
        this.status = 409 // conflict
      }
      return this
    }
  }
)

/**
* Find user my email and check if the password is valid.
* @param options {
*   email {String} User's email.
*   password {String} User's password.
* }
* @return {models.User} User instance is returned on success else null or error.
*/
function login(opts) {
  debug('login for %s...', opts.email)
  
  return User.findOne({email: opts.email}).then(user => {
    
    if(user) {
      // hash password with user-unique salt
      return user.hashPassword(opts.password).then(password_hash => {
        // if salted passwords match return the user
        if(password_hash && password_hash.equals(user.password_hash))
          return user.resetSession()

        return new LoginPasswordError().reject()
      })
    } else {
      return new LoginUsernameError().reject()
    }
  })
}

/**
* Create a new user.
* @param options {
*   email {String} User's email (must be unique). 
*   password {String} A password as plain-text.
* }
* @return {model.User} User instance is returned on success else null or error.
*/
function register(opts) {
  const user = new User({email: opts.email})
  
  return user.hashPassword(opts.password).then(password_hash => {
      user.password_hash = password_hash
      // save the user and return it.
      return user.save().catch(e => {
        return new RegistrationError().setError(e).reject()
      })
    }).tap(debug)
}

/**
* Returns true of a user may logout (or just exists).
* @param options {
*   name {String} The user's name to logout
* }
* @param user {UserModel} A user object that's already been retrieved from the db.
*/
function logout(opts, user) {
  if (user) {
    return user.resetSession().return(true)
  } else {
    return User.findOne(opts).then(user => {
      if(user) {
        return user.resetSession().return(true)
      } else {
        return new NoSuchUser().reject()
      }
    })  
  }
}

/**
* Verify the user's session_key matches the currently dispatched one.
*/
function verifySession(opts) {
  return User.findOne({_id: opts._id, session_key: opts.session_key})
}

module.exports.verifySession = verifySession
module.exports.login = login
module.exports.logout = logout
module.exports.register = register