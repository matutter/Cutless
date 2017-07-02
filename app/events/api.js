
const debug = require('debug')('app.events.api');
const validators = require('validator');
const Events = require('./model.js');

debug('loaded');

function findUserEvent(query) {
  return Events.UserEventModel.find(query)
}

module.exports = {
  create: Events.EventModel.create.bind(Events.EventModel),
  users: {
    create: Events.UserEventModel.create.bind(Events.UserEventModel),
    find: findUserEvent
  }
};