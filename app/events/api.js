
const debug = require('debug')('app.events.api');
const validators = require('validator');
const Events = require('./model.js');

debug('loaded');

function createUserEvent(user, msg, tags) {
  
  return Events.UserEventModel.create({
    user: user,
    message: msg,
    tags: tags || {}
  });
}

module.exports = {
  create: Events.EventModel.create.bind(Events.EventModel),
  users: {
    create: createUserEvent
  }
};