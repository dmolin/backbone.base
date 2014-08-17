var _ = global._,
    Backbone = require('backbone')
    extend = require('./extend');

var BaseModel = Backbone.Model.extend({
    toJSON: function() {
        //be sure to clone deep the attribute set
        return extend(true, {}, Backbone.Model.prototype.toJSON.apply(this, arguments));
    }
});

module.exports = BaseModel;


