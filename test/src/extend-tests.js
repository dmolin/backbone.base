var extend = require('../../src/extend'),
    _ = require('underscore');

describe('extend', function() {
    it('exports a function', function() {
        expect(_.isFunction(extend)).to.be.true;
    });


});