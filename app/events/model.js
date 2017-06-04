const debug = require('debug')('app.events.model')
const validators = require('validator')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

debug('loaded')

const options = {
  discriminatorKey: 'source',
  timestamps: true
};

const EventSchema = new Schema({
  message : {
    required: true,
    type: String
  },
  // any abitrary tags to help sort/search events
  tags : [String]
}, options);

EventSchema.pre('save', beforeSave)
function beforeSave(next) {
  debug(`${this.message} [${this.tags}]`)
  next();
}

const UserEventSchema = new Schema({
  user : { type: Schema.Types.ObjectId, ref: 'User' }
}, options)

const EventModel = mongoose.model('Event', EventSchema);
const UserEventModel = EventModel.discriminator('user', UserEventSchema);

module.exports.EventModel = EventModel
module.exports.UserEventModel = UserEventModel
