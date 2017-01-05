const debug = require('debug')('dn.api.users')
const validators = require('validator')
const mongoose = require('mongoose')
const Schema = require('./schemas').user


const User = mongoose.model('User', Schema);

function login(opts) {
  debug('login for %s', opts.email)
  return User.findOne({email: opts.email}).then(user => {
    if(user) debug('success')
    return user
  })
}

function register(opts) {
  const user = new User({email: opts.email})
  
  return user.hashPassword(opts.password).then(password_hash => {
      user.password_hash = password_hash
      return user.save()
    }).tap(debug)
}

module.exports.login = login
module.exports.register = register