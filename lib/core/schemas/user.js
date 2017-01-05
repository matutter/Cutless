const debug = require('debug')('dn.core.schemas.user')
const validators = require('validator')
const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const UserSchema = new Schema({
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
    password_hash: { type: String, required: true },
    password_salt: { type: Buffer, default: getFreshSalt },
});

function getFreshSalt() {
  return crypto.randomBytes(16)
}

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

UserSchema.methods.hashPassword = hashPassword
module.exports.schema = UserSchema
