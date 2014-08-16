'use strict';

var BaseView = require('./src/backbone.base.view'),
    BaseModel = require('./src/backbone.base.model'),
    BaseCollection = require('./src/backbone.base.collection');

module.exports = {
    Model: BaseModel,
    Collection: BaseCollection,
    View: BaseView
};