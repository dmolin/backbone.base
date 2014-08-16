var _ = require('underscore'),
    Backbone = require('backbone');

var BaseCollection = Backbone.Collection.extend({
    toJSON: function() {
        return this.map(function(model){ return model.toJSON(); });
    }
});
module.exports = BaseCollection;


