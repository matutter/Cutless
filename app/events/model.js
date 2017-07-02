const debug = require('debug')('app.events.model')
const validators = require('validator')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

debug('loaded')

const options = {
  discriminatorKey: 'source'
};

const EventSchema = new Schema({
  method : { type: String },
  action : { type: String, required: true },
  issuer : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject : { type: Schema.Types.ObjectId, ref: 'User' },
  result : Number,
  message : String,
  // any abitrary tags to help sort/search events
  tags : [String],
  createdAt: { type: Date, default: Date.now }
}, options);

function beforeSave(next) {
  var method = this.method || ''
  debug(`${method}${this.action} issued by ${this.issuer._id}, result was ${this.result}: ${this.message}`);
  next();
}

const UserEventSchema = new Schema({
  user : { type: Schema.Types.ObjectId, ref: 'User' }
}, options)

EventSchema.pre('save', beforeSave)
//UserEventSchema.pre('save', beforeSave)

const EventModel = mongoose.model('Event', EventSchema);
const UserEventModel = EventModel.discriminator('user', UserEventSchema);

module.exports.EventModel = EventModel
module.exports.UserEventModel = UserEventModel
