/**
* This is the *users* module api exports. Module api's only export functions for interacting with their features.
* The user module exports function for interacting with the users api such as login, logout, and other functions to
* support how users interact with the site.
*/

const debug = require('debug')('app.users.api');
const validators = require('validator');
const User = require('./model.js').UserModel;

debug('loaded');

const LoginUsernameError = ApiError(
  'Unknown Email', 
  'The email you entered doesn\'t belong to an account. Please check your email and try again.', {
  status: 404,
})
const LoginPasswordError = ApiError(
  'Incorrect Password',
  'Sorry, your password was incorrect. Please double-check your password.', {
  status: 401,
})
const NoSuchUser = ApiError(
  'No such user',
  'The user specified does not exist', {
  status: 404
})
const RegistrationError = ApiError(
  'Registration Error', null, {
    setError : function(e) {
      // mongo db duplicate code error
      if(e.code == 11000) {
        this.message = 'That username is not available, please try a different name.'
        this.status = 409 // conflict
      } else if(e.errors) {
        if(e.errors.email) {
          this.message = e.errors.email.message
        }
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
  //debug('login for %s...', opts.email);
  
  return User.findOne({email: opts.email}).then(user => {
    
    if(user) {
      // hash password with user-unique salt
      return user.hashPassword(opts.password).then(password_hash => {
        // if salted passwords match return the user
        if(password_hash && password_hash.equals(user.password_hash)) {
          return user.resetSession()
        }
        
        var e = new LoginPasswordError();
        e.user_id = user._id;
        return e.reject()
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
        return new RegistrationError().setError(e).reject();
      })
    }).tap(debug);
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
        return user.resetSession().return(true);
      } else {
        return new NoSuchUser().reject();
      }
    });
  }
}

/**
* Verify the user's session_key matches the currently dispatched one.
*/
function verifySession(opts) {
  return User.findOne({_id: opts._id, session_key: opts.session_key});
}

/**
* Change a user's password to a new one.
* @param current {String} The current password.
* @param new_passowrd {String} The new password.
*/
function updatePassword(current, new_password, user) {
  
  if(user == null || user === undefined) {
    return new NoSuchUser().reject();
  }
  
  return user.hashPassword(current).then(password_hash => {
    if(password_hash.equals(user.password_hash)) {
      return user.hashPassword(new_password)
    } else {
      return new LoginPasswordError().reject()
    }
  }).then(new_hash => {
      user.password_hash = new_hash;

      return user.save().catch(e => {
        return new RegistrationError().setError(e).reject();
      })
  })
  .then(user => user.resetSession().return(true))
}


module.exports.updatePassword = updatePassword;
module.exports.verifySession = verifySession;
module.exports.login = login;
module.exports.logout = logout;
module.exports.register = register;
