var _ = require('underscore'),
    sinon = require('sinon'),
    mocks = require('./mocks');


var TestFW = function() {
    this.mocks = new Mocks();
    this.stubs = new Stubs(this.mocks);
};

TestFW.prototype = {
    stub: function(stub) {
        return this.stubs.add(stub);
    },
    clear: function() {
        this.stubs.clear();
    }
};

//Stubs management
var Stubs = function(mocks) {
    this.stubs = [];
    this.mocks = mocks;
};

Stubs.prototype = {
    add: function(stub) {
        this.stubs.push(stub);
        return stub;
    },
    clear: function() {
        _.each(this.stubs, function(s){ s.restore(); });
        this.stubs = [];
    },
    policy: function(key) {
        //stub this policy
        return this.add(_stubPolicy(key, this.mocks));
    }
};

//Mocks Management
var Mocks = function() {
    this.mocks = mocks;
};

Mocks.prototype = {
    policy: function(key, parsedCallback) {
        var policy = new Policy();
        var _this = this;

        if(_.isString(key) && !this.mocks[key]) return policy;

        var stub = _stubPolicy(key, this, parsedCallback);

        //it's necessary to do a fetch, in order to go through the parse() flow...
        policy.fetch();
        stub.restore();
        return policy;
    },

    mix: function(dest) {
        var dst = dest, args = Array.prototype.slice.call(arguments).splice(1);

        //mix all the additional arguments into the first argument (dest)
        //if the first argument is a Backbone model, it will mix into its attributes
        //return the first argument
        if(dst instanceof Backbone.Model || dst.attributes) {
            dst = dest.attributes;
        }
        _.each(args, function(arg){ _.extend(dst, arg); });
        return dest;
    },

    get: function(key) {
        return _.cloneToDepth((this.mocks[key] || {}), 10);
    }
};


function _stubPolicy(key, mocks, parsedCallback) {
    var stub = sinon.stub(Policy.prototype, 'sync', function(op, model, opts){
        if(op === 'read') {
            var json;
            if(!key) {
                key = model.id;
                //find the mock whose name matches the id of the model
            }

            if(_.isString(key)) {
                json = _.cloneToDepth((mocks.mocks[key] || {}), 10);
            } else {
                json = key;
            }

            if(_.isFunction(parsedCallback)) {
                //we can piggyback more data or have a chance to change the json payload before the parse
                parsedCallback(json);
            }
            //call success callback on options, with mocking the payload coming from the network request
            opts.success(model, json, opts);
        }
    });
    return stub;
}

module.exports = TestFW;
