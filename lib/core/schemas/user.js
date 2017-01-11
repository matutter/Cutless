const debug = require('debug')('dn.core.schemas.user')
const validators = require('validator')
const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name : {
      type: String,
      unique: true
    },
    email : {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Only valid email addresses are accepted.'],
      validate: {
        validator: (v, cb) => cb(validators.isEmail(v)),
        message: '{VALUE} does not appear to be a valid email address.'
       }
    },
    password_hash: { type: Buffer, required: true },
    password_salt: { type: Buffer, default: getFreshSalt },
    session_key: { type: String, default: getFreshSalt64 }
});

UserSchema.pre('save', beforeSave)
function beforeSave(next) {
  if (!this.name) {
    this.name = this.email.replace(/@.*/,'')
  }
  next()
}

UserSchema.methods.public = function() {
  var public = {
    _id: this._id,
    session_key: this.session_key
  }
  return public
}

UserSchema.methods.resetSession = function() {
  this.session_key = getFreshSalt64()
  return this.save()
}

UserSchema.methods.hashPassword = hashPassword
function hashPassword(raw_password) {
  const iterations = 10000;
  const bit_length = 64;

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(raw_password, this.password_salt, iterations, bit_length, 'sha512', (e, hash) => {
      if (e) return reject(e)
      return resolve(hash)
    });
  })
}

function getFreshSalt() {
  return crypto.randomBytes(16)
}

function getFreshSalt64() {
  return getFreshSalt().toString('base64')
}

module.exports.schema = UserSchema
